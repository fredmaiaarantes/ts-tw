import React, { Suspense } from 'react';
import { Hello } from './Hello';
import { Info } from './Info';

export const App = () => (
  <div className="max-w-3xl min-h-screen mx-auto sm:pt-10">
    <Hello/>
    <Suspense fallback={
      <div className="flex items-center justify-center p-12 text-gray-500">
        <svg className="animate-spin h-6 w-6 mr-3 text-indigo-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Loading...
      </div>
    }>
      <Info/>
    </Suspense>
  </div>
);
