import Navbar from '../Components/Navbar';
import ToastContainer from '../Components/ToastContainer';

export default function PublicLayout({ children }) {
    return (
        <div>
            <Navbar />
            <main style={{ paddingTop: '65px' }}>
                {children}
            </main>
            <ToastContainer />
        </div>
    );
}