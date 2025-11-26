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
        const { data: authData, error: authError } = await signUp(email, password, { 
            full_name, 
            role 
        });
        console.log("Auth Data:", authData);    
        if (authError) {
            let errorMessage = authError.message;
            if (authError.code === 'email_address_invalid') {
                errorMessage = 'Invalid email address. Please use a valid email domain.';
            } else if (authError.code === 'signup_disabled') {
                errorMessage = 'Account creation is currently disabled. Please contact support.';
            }
            return res.status(400).json({ error: errorMessage });
        }

        if (!authData.user) {
            return res.status(400).json({ 
                error: "Account creation failed. This email may already be registered or invalid." 
            });
        }

        // Return success - profile will be created when needed
        const message = "Account created successfully! Please check your email to confirm your account before logging in.";
            
        return res.status(201).json({ 
            message, 
            user: authData.user,
            needsEmailConfirmation: true
        });

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
            let errorMessage = authError.message;
            if (authError.code === 'invalid_credentials') {
                errorMessage = 'Invalid email or password. Please check your credentials.';
            } else if (authError.code === 'email_not_confirmed') {
                errorMessage = 'Please confirm your email address before logging in. Check your inbox for a confirmation link.';
            }
            return res.status(401).json({ error: errorMessage });
        }

        // Fetch Profile details (role, full_name)
        let { data: profileData, error: profileError } = await getProfileByEmail(email);

        if (profileError) {
            // Profile doesn't exist yet - create it now that user is confirmed
            console.log("Profile not found, creating for confirmed user:", email);
            
            const profilePayload = {
                email: email,
                full_name: authData.user.user_metadata?.full_name || '',
                role: authData.user.user_metadata?.role || 'buyer'
            };
            
            const { data: newProfileData, error: createError } = await createProfile(profilePayload);
            
            if (createError) {
                console.error("Failed to create profile:", createError);
                return res.status(500).json({ 
                    error: "Failed to create user profile. Please contact support." 
                });
            }
            
            profileData = newProfileData;
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
