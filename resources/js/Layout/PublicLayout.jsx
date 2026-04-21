import Navbar from '../Components/Navbar';
import ToastContainer from '../Components/ToastContainer';

export default function PublicLayout({ children }) {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            {children}
            <ToastContainer />
        </div>
    );
}