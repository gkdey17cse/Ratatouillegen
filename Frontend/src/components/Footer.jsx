import React from "react";

export default function Footer() {
    return (
        <div className="mt-4 py-2 lg:mt-0 xl:py-3">
        <div className="container mx-auto text-center">
            <p className="text-xs lg:text-sm leading-loose text-gray-700">
            &copy; {new Date().getFullYear()} RatatouilleGen - COSYLAB, IIIT Delhi. All rights reserved.
            </p>
        </div>
        </div>
    );
}