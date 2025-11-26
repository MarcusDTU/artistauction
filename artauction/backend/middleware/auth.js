import { supabase } from '../dbConfig.js';

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        // Verify the JWT token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error) {
            return res.status(401).json({ error: 'Invalid token: ' + error.message });
        }

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Add user to request object for use in subsequent middleware/routes
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ error: 'Token verification failed' });
    }
};

export const requireRole = (roles) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        try {
            // Fetch user profile to check role
            const { data: profile, error } = await supabase
                .from('Profile')
                .select('role')
                .eq('id', req.user.id)
                .single();

            if (error) {
                console.error('Role check error:', error);
                return res.status(403).json({ error: 'Unable to verify user role' });
            }

            if (!profile || !roles.includes(profile.role)) {
                return res.status(403).json({ 
                    error: `Access denied. Required role: ${roles.join(' or ')}` 
                });
            }

            req.userRole = profile.role;
            next();
        } catch (error) {
            console.error('Role middleware error:', error);
            return res.status(403).json({ error: 'Role verification failed' });
        }
    };
};