'use client';
import React, { useEffect, useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

function OTPVerification() {
  const router = useRouter();
  const params = useParams();
  const username = decodeURIComponent(params.username);

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error('Please enter the OTP code.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('/api/verifyEmail', {
        username: username,
        verifyCode: otp,
      });

      const data = res.data;
      console.log(data);
      toast.success('User verified successfully!');
      router.replace("/login");
    } catch (error) {
      console.log(error);
      const message =
        error.response?.data?.message ||
        error.message ||
        'Something went wrong';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(()=>{
  //   async function getVerifyCode (){
  //     const res = await axios.get(`/api/verify/${username}`)
  //     console.log("verify code page username fetch : "+res.data);
  //   }
  //   getVerifyCode()
  // },[username])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">#</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Enter Verification Code
          </h1>
          <p className="text-gray-600">
            We sent a code to verify your identity
          </p>
          {username && (
            <div className="mt-3 px-3 py-1 bg-gray-100 rounded-full inline-block">
              <span className="text-sm font-medium text-gray-700">
                {username}
              </span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full px-1 py-1 text-center text-lg font-mono tracking-widest border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-black focus:outline-none transition-all duration-200 placeholder-gray-400"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <span>Verify Code</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Did not receive the code?{' '}
            <button className="text-black font-medium hover:underline">
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default OTPVerification ;