import React from 'react'

export default function TermsAndConditionsModule({ isOpen, onClose }) {
    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? 'visible' : 'hidden'}`}>
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="bg-white p-8 rounded-lg z-50 max-w-md w-full">
                <button
                    onClick={onClose}
                    aria-label="Close"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-xl font-semibold mb-4">Terms and Conditions</h2>
                <h2 className="text-xl font-semibold mb-4">NestAway Terms and Conditions</h2>
                <div className="text-gray-700">
                    <p>Welcome to NestAway! These terms and conditions ("Terms") govern your use of our platform and services. By accessing or using NestAway, you agree to comply with these Terms. Please read them carefully.</p>
                    <p>NestAway provides an online platform that connects homeowners ("Hosts") and tenants ("Guests") for rental accommodation. Our services include:</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Listing and booking rental properties</li>
                        <li>Communication between Hosts and Guests</li>
                        <li>Payment processing for bookings</li>
                    </ul>
                    <p>For detailed Terms and Conditions, please contact us at Stevens.</p>
                </div>
            </div>
        </div>
    )
}
