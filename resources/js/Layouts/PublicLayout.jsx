// Layout component for public-facing pages with a fixed navbar and toast notifications

import Navbar from '../Components/Navbar';
import ToastContainer from '../Components/ToastContainer';

export default function PublicLayout({ children }) {
    return (
        <div>
            <Navbar />
            {/* Main content area with padding to account for the fixed navbar */}
            <main style={{ paddingTop: '65px' }}>
                {children}
            </main>
            <ToastContainer />
        </div>
    );
}