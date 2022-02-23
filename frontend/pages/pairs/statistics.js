import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import TopNavigation from '../../components/TopNavigation';

export default function Home() {
    return (
        <div className="flex">
            <Sidebar currentPage={'pairs'} />
            <div className="content-container">
                <TopNavigation />
                ahhh
            </div>
        </div>
    );
}
