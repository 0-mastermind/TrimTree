"use client";
import React from 'react';
import { Image, Star, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const page = () => {
  const router = useRouter();

  const managementOptions = [
    {
      id: 'slider',
      title: 'Manage Slider',
      description: 'Add, edit or remove slides from the homepage carousel',
      icon: Image,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      route: 'landingpage/slides'
    },
    {
      id: 'reviews',
      title: 'Manage Reviews',
      description: 'Manage customer testimonials and reviews',
      icon: Star,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      route: 'landingpage/reviews'
    }
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold  mb-4">
            Landing Page Manager
          </h1>
          <p className="text-lg text-slate-600 max-w-md mx-auto leading-relaxed">
            Manage your website content and appearance 
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {managementOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                className="group relative bg-white rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => router.push(option.route)}
              >
                {/* Background Gradient Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative p-8">
                  {/* Icon Container */}
                  <div className={`${option.color} w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-semibold text-slate-800 mb-3">
                    {option.title}
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed text-[15px]">
                    {option.description}
                  </p>

                  {/* Action Button */}
                  <div className="flex items-center text-blue-600 font-semibold text-[15px]">
                    <span className="group-hover:text-blue-700 transition-colors duration-300">
                      Manage Content
                    </span>
                    <ArrowRight className="w-4 h-4 ml-3 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </div>

                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200/50 transition-all duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <p className="text-slate-500 text-sm">
            Select a section to manage your landing page content
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;