import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${backendUrl}/api/user/reset-password`, {
                token,
                newPassword
            });

            if (response.data.success) {
                toast.success("Password reset successful!");
                navigate('/login');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form 
                onSubmit={handleSubmit} 
                className="flex flex-col items-center w-[90%] sm:max-w-96 gap-4 text-gray-800 bg-white p-8 rounded-lg shadow-md"
            >
                <div className="inline-flex items-center gap-2 mb-6">
                    <p className="font-hubot text-3xl">Reset Password</p>
                    <hr className="border-none h-[2px] w-8 bg-gray-800" />
                </div>

                <input
                    onChange={(e) => setNewPassword(e.target.value)}
                    value={newPassword}
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#5c2674] transition-colors"
                    placeholder="New Password (min 8 characters)"
                    required
                    minLength={8}
                />

                <input
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#5c2674] transition-colors"
                    placeholder="Confirm New Password"
                    required
                    minLength={8}
                />

                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-red-500 text-sm">Passwords don't match</p>
                )}

                <button 
                    type="submit"
                    disabled={loading || newPassword !== confirmPassword || newPassword.length < 8}
                    className="w-full bg-black text-white font-light px-8 py-3 mt-4 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>

                <p 
                    onClick={() => navigate('/login')}
                    className="text-sm text-[#5c2674] cursor-pointer hover:underline mt-4"
                >
                    Back to Login
                </p>
            </form>
        </div>
    );
};

export default ResetPassword;