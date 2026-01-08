import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  const breadcrumbMap = {
    '': 'Home',
    analyses: 'Analyses',
    company: 'Company Dashboard',
    employees: 'Employees',
    analytics: 'Analytics',
    companies: 'All Companies',
    admin: 'System Admin',
    settings: 'Settings',
    users: 'Users',
  };

  const getBreadcrumbLabel = (path) => {
    return breadcrumbMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  if (paths.length === 0) {
    return null;
  }

  return (
    <nav className="bg-gray-50 border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link
              to="/"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Home className="w-4 h-4" />
            </Link>
          </li>
          {paths.map((path, index) => {
            const isLast = index === paths.length - 1;
            const pathTo = '/' + paths.slice(0, index + 1).join('/');
            const label = getBreadcrumbLabel(path);

            return (
              <li key={pathTo} className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                {isLast ? (
                  <span className="text-gray-900 font-medium">{label}</span>
                ) : (
                  <Link
                    to={pathTo}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

