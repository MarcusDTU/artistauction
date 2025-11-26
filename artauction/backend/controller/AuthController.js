import { signUp, signIn, updatePassword, createProfile, getProfileByEmail, requestPasswordReset } from "../model/AuthModel.js";
import { supabase } from "../dbConfig.js";

export const register = async (req, res) => {
    const { email, password, full_name, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ error: "Email, password, and role are required" });
    }

    try {
        console.log("Registering user:", email, role); 
        // 1. Create Supabase Auth User
        const { data: authData, error: authError } = await signUp(email, password, { full_name, role });
        console.log("Auth Data:", authData);    
        if (authError) {
            return res.status(400).json({ error: authError.message });
        }

        if (!authData.user) {
            return res.status(400).json({ error: "User creation failed" });
        }

        // 2. Create Profile in public.Profile table
        // Note: We use the returned user ID from auth if needed, but our schema relies on email as unique key for now or just inserts.
        // Actually, our Profile table has profile_id as identity. We should insert email, role, full_name.

        const profilePayload = {
            email: email,
            full_name: full_name,
            role: role,
            // avatar_url: default?
        };
        console.log("Creating profile with payload:")  
        try{
        const { data: profileData, error: profileError } = await createProfile(profilePayload);
        
        return res.status(201).json({ user: authData.user, profile: profileData });
        } catch(profileErr){
            console.error("Profile creation error:", profileErr);
            return res.status(500).json({ error: "Profile creation failed" });
        }

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const { data: authData, error: authError } = await signIn(email, password);

        if (authError) {
            return res.status(401).json({ error: authError.message });
        }

        // Fetch Profile details (role, full_name)
        const { data: profileData, error: profileError } = await getProfileByEmail(email);

        if (profileError) {
            return res.status(404).json({ error: "Profile not found" });
        }

        return res.json({
            session: authData.session,
            user: authData.user,
            profile: profileData
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export const resetPassword = async (req, res) => {
    const { password, access_token, refresh_token } = req.body;

    if (!password || !access_token || !refresh_token) {
        return res.status(400).json({ error: "Password and tokens are required" });
    }

    try {
        const { data, error } = await updatePassword(access_token, refresh_token, password);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        return res.json({ message: "Password updated successfully" });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export const forgotPassword = async (req, res) => {
    const { email, redirectTo } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        const { data, error } = await requestPasswordReset(email, redirectTo);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        return res.json({ message: "Password reset link sent" });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
