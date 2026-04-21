import AdminLayout from '../../../Layout/AdminLayout';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const statusStyle = {
    pending:     'bg-yellow-100 text-yellow-800',
    confirmed:   'bg-green-100 text-green-800',
    rescheduled: 'bg-blue-100 text-blue-800',
    cancelled:   'bg-red-100 text-red-800',
};

const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM',
    '2:00 PM', '3:00 PM', '4:00 PM',
];

export default function Index({ bookings, stats }) {
    const { flash } = usePage().props;
    const [filter, setFilter] = useState('all');
    const [modal, setModal] = useState(null); // { type, booking }
    const [form, setForm] = useState({ confirmed_date: '', confirmed_time: '', admin_response: '' });

    const filtered = filter === 'all'
        ? bookings
        : bookings.filter(b => b.status === filter);

    function openModal(type, booking) {
        setModal({ type, booking });
        setForm({ confirmed_date: '', confirmed_time: '', admin_response: '' });
    }

    function closeModal() {
        setModal(null);
    }

    function submitConfirm() {
        router.put(`/admin/bookings/${modal.booking.reference_number}/confirm`, form, {
            onSuccess: closeModal,
        });
    }

    function submitReschedule() {
        router.put(`/admin/bookings/${modal.booking.reference_number}/reschedule`, form, {
            onSuccess: closeModal,
        });
    }

    function submitCancel() {
        router.put(`/admin/bookings/${modal.booking.reference_number}/cancel`, { admin_response: form.admin_response }, {
            onSuccess: closeModal,
        });
    }

    function deleteBooking(reference_number) {
        if (confirm('Delete this booking permanently?')) {
            router.delete(`/admin/bookings/${reference_number}`);
        }
    }

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-medium text-gray-800">Consultation Bookings</h1>
                <p className="text-gray-500 text-sm mt-1">Manage all client consultation requests.</p>
            </div>

            {flash?.success && (
                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
                    {flash.success}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total', value: stats.total, color: 'text-gray-800' },
                    { label: 'Pending', value: stats.pending, color: 'text-yellow-700' },
                    { label: 'Confirmed', value: stats.confirmed, color: 'text-green-700' },
                    { label: 'Cancelled', value: stats.cancelled, color: 'text-red-700' },
                ].map(({ label, value, color }) => (
                    <div key={label} className="bg-white rounded-xl p-5 border border-gray-100 text-center">
                        <p className={`text-3xl font-medium ${color}`}>{value}</p>
                        <p className="text-gray-400 text-sm mt-1">{label}</p>
                    </div>
                ))}
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 mb-6">
                {['all', 'pending', 'confirmed', 'rescheduled', 'cancelled'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-1.5 rounded-full text-sm transition capitalize ${
                            filter === tab
                                ? 'bg-green-700 text-white'
                                : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Bookings list */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 px-6 py-16 text-center text-gray-400 text-sm">
                    No bookings found.
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map(booking => (
                        <div key={booking.id} className="bg-white rounded-xl border border-gray-100 p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-medium text-gray-800">{booking.name}</h3>
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusStyle[booking.status] ?? 'bg-gray-100 text-gray-500'}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-500">
                                        <p>📧 {booking.email}</p>
                                        <p>📞 {booking.phone}</p>
                                        <p>🛠 {booking.service_type}</p>
                                        <p>📅 {booking.preferred_date} at {booking.preferred_time}</p>
                                        <p>💬 {booking.consultation_type}</p>
                                        <p className="text-xs text-gray-400">Ref: {booking.reference_number}</p>
                                    </div>
                                    {booking.message && (
                                        <p className="mt-2 text-sm text-gray-500 italic">"{booking.message}"</p>
                                    )}
                                    {booking.admin_response && (
                                        <p className="mt-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                                            Admin note: {booking.admin_response}
                                        </p>
                                    )}
                                    {(booking.confirmed_date || booking.confirmed_time) && (
                                        <p className="mt-2 text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded-lg">
                                            Scheduled: {booking.confirmed_date} at {booking.confirmed_time}
                                        </p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2 flex-shrink-0">
                                    {booking.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => openModal('confirm', booking)}
                                                className="px-3 py-1.5 bg-green-700 text-white rounded-lg text-xs hover:bg-green-800 transition"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => openModal('reschedule', booking)}
                                                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition"
                                            >
                                                Reschedule
                                            </button>
                                            <button
                                                onClick={() => openModal('cancel', booking)}
                                                className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                    {booking.status === 'confirmed' && (
                                        <button
                                            onClick={() => openModal('reschedule', booking)}
                                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition"
                                        >
                                            Reschedule
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteBooking(booking.reference_number)}
                                        className="px-3 py-1.5 border border-gray-200 text-gray-400 rounded-lg text-xs hover:bg-gray-50 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="font-medium text-gray-800 mb-4 capitalize">
                            {modal.type} booking — {modal.booking.name}
                        </h2>

                        {(modal.type === 'confirm' || modal.type === 'reschedule') && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-sm text-gray-600 mb-1">Confirmed Date</label>
                                    <input
                                        type="date"
                                        value={form.confirmed_date}
                                        onChange={e => setForm({ ...form, confirmed_date: e.target.value })}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm text-gray-600 mb-1">Confirmed Time</label>
                                    <select
                                        value={form.confirmed_time}
                                        onChange={e => setForm({ ...form, confirmed_time: e.target.value })}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                                    >
                                        <option value="">-- Select time --</option>
                                        {timeSlots.map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        <div className="mb-6">
                            <label className="block text-sm text-gray-600 mb-1">
                                {modal.type === 'cancel' ? 'Reason for cancellation (optional)' : 'Note to client (optional)'}
                            </label>
                            <textarea
                                value={form.admin_response}
                                onChange={e => setForm({ ...form, admin_response: e.target.value })}
                                rows={3}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 resize-none"
                                placeholder="Add a note..."
                            />
                        </div>

                        <div className="flex gap-3">
                            {modal.type === 'confirm' && (
                                <button
                                    onClick={submitConfirm}
                                    className="flex-1 bg-green-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-800 transition"
                                >
                                    Confirm Booking
                                </button>
                            )}
                            {modal.type === 'reschedule' && (
                                <button
                                    onClick={submitReschedule}
                                    className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                                >
                                    Reschedule Booking
                                </button>
                            )}
                            {modal.type === 'cancel' && (
                                <button
                                    onClick={submitCancel}
                                    className="flex-1 bg-red-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-600 transition"
                                >
                                    Cancel Booking
                                </button>
                            )}
                            <button
                                onClick={closeModal}
                                className="px-4 py-2.5 border border-gray-200 text-gray-500 rounded-lg text-sm hover:bg-gray-50 transition"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}