import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BarChart3, Users, TrendingUp, DollarSign, Activity, Calendar } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      icon: Users,
      title: 'Total Users',
      value: '12,345',
      change: '+12%',
      changeType: 'positive'
    },
    {
      icon: DollarSign,
      title: 'Revenue',
      value: '$45,678',
      change: '+8%',
      changeType: 'positive'
    },
    {
      icon: TrendingUp,
      title: 'Growth Rate',
      value: '23.5%',
      change: '+5%',
      changeType: 'positive'
    },
    {
      icon: Activity,
      title: 'Active Sessions',
      value: '1,234',
      change: '-2%',
      changeType: 'negative'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'New user registered', time: '2 minutes ago', type: 'user' },
    { id: 2, action: 'Payment processed', time: '5 minutes ago', type: 'payment' },
    { id: 3, action: 'System backup completed', time: '1 hour ago', type: 'system' },
    { id: 4, action: 'New feature deployed', time: '2 hours ago', type: 'deployment' },
    { id: 5, action: 'Security scan completed', time: '3 hours ago', type: 'security' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="w-4 h-4" />;
      case 'payment': return <DollarSign className="w-4 h-4" />;
      case 'system': return <Activity className="w-4 h-4" />;
      case 'deployment': return <TrendingUp className="w-4 h-4" />;
      case 'security': return <BarChart3 className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'payment': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'system': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'deployment': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'security': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your account today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' 
                    ? 'text-green-600 bg-green-100 dark:bg-green-900/20' 
                    : 'text-red-600 bg-red-100 dark:bg-red-900/20'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                {stat.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {stat.title}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Analytics Overview
                </h2>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last 30 days</span>
                </div>
              </div>
              
              {/* Mock Chart */}
              <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl flex items-center justify-center border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Interactive charts would be displayed here
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Recent Activities
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)} group-hover:scale-110 transition-transform duration-200`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 font-medium transition-colors duration-200">
                View all activities
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Create Project', icon: '🚀', color: 'from-blue-500 to-blue-600' },
              { title: 'Invite Users', icon: '👥', color: 'from-green-500 to-green-600' },
              { title: 'View Reports', icon: '📊', color: 'from-purple-500 to-purple-600' },
              { title: 'Settings', icon: '⚙️', color: 'from-orange-500 to-orange-600' }
            ].map((action, index) => (
              <button
                key={index}
                className={`p-4 rounded-xl bg-gradient-to-r ${action.color} text-white hover:scale-105 transition-all duration-200 hover:shadow-lg group`}
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
                  {action.icon}
                </div>
                <p className="font-medium">{action.title}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;