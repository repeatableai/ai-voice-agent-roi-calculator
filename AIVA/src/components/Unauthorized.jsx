import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

export default function Unauthorized() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-lg text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
          <div className="space-y-2">
            <div>
              <span className="text-sm font-semibold text-gray-700">Your Role: </span>
              <span className="text-sm text-gray-900">
                {user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'admin' ? 'Admin' : 'User'}
              </span>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-700">Your Email: </span>
              <span className="text-sm text-gray-900">{user?.email}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          If you believe you should have access to this page, please contact your administrator.
        </p>
      </div>
    </div>
  );
}

