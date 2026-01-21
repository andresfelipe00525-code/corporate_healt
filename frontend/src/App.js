import { useState, useEffect } from 'react';
import '@/App.css';
import axios from 'axios';
import {
	ClipboardCheck,
	Stethoscope,
	FileCheck,
	Monitor,
	HeartPulse,
	GraduationCap,
	Menu,
	X,
	Phone,
	MapPin,
	Mail,
	Clock,
	Check,
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = BACKEND_URL ? `${BACKEND_URL}/api` : '';

// Icon mapping
const iconMap = {
	'clipboard-check': ClipboardCheck,
	stethoscope: Stethoscope,
	'file-check': FileCheck,
	monitor: Monitor,
	'heart-pulse': HeartPulse,
	'graduation-cap': GraduationCap,
};

// Service images
const serviceImages = [
	'https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?w=400&h=300&fit=crop',
	'https://images.unsplash.com/photo-1631815590016-ebce183022ce?w=400&h=300&fit=crop',
	'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
	'https://images.pexels.com/photos/7563580/pexels-photo-7563580.jpeg?w=400&h=300&fit=crop',
	'https://images.unsplash.com/photo-1516841273335-e39b37888115?w=400&h=300&fit=crop',
	'https://images.pexels.com/photos/4421494/pexels-photo-4421494.jpeg?w=400&h=300&fit=crop',
];

function App() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		message: '',
	});
	const [services, setServices] = useState([]);
	const [submitStatus, setSubmitStatus] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		const fetchServices = async () => {
			try {
				if (!API) throw new Error('Backend URL not configured');

				const response = await axios.get(`${API}/services`);
				const data = response.data;

				setServices(Array.isArray(data) ? data : data.services || []);
			} catch (e) {
				console.error('Error fetching services:', e);
				setServices([
					{
						id: '1',
						title: 'Medical Evaluations',
						description:
							'Occupational medical examinations to monitor the health of your workers.',
						icon: 'clipboard-check',
					},
					{
						id: '2',
						title: 'Occupational Exams',
						description:
							'Specialized tests to detect workplace risks and occupational diseases.',
						icon: 'stethoscope',
					},
					{
						id: '3',
						title: 'Work Certificates',
						description:
							'Issuance of work aptitude certificates to comply with regulations.',
						icon: 'file-check',
					},
					{
						id: '4',
						title: 'Online Platform',
						description:
							'Consult and download certificates from our web portal.',
						icon: 'monitor',
					},
					{
						id: '5',
						title: 'Health Programs',
						description:
							'Comprehensive health and wellness programs for your workforce.',
						icon: 'heart-pulse',
					},
					{
						id: '6',
						title: 'Safety Training',
						description:
							'Training and education on workplace safety and health protocols.',
						icon: 'graduation-cap',
					},
				]);
			}
		};

		fetchServices();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await axios.post(`${API}/contact`, formData);
			setSubmitStatus({
				type: 'success',
				message: 'Message sent successfully!',
			});
			setFormData({ name: '', email: '', message: '' });
		} catch {
			setSubmitStatus({
				type: 'error',
				message: 'Error sending message. Please try again.',
			});
		}

		setIsSubmitting(false);
		setTimeout(() => setSubmitStatus(null), 5000);
	};

	const scrollToSection = (id) => {
		const element = document.getElementById(id);
		if (element) element.scrollIntoView({ behavior: 'smooth' });
		setMenuOpen(false);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
			{/* HEADER OMITIDO POR BREVEDAD (no cambia) */}

			{/* SERVICES SECTION */}
			<section id="services" className="py-20 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h3 className="text-3xl md:text-4xl font-bold text-blue-900">
							Our Services
						</h3>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{Array.isArray(services) &&
							services.map((service, index) => {
								const IconComponent = iconMap[service.icon] || ClipboardCheck;

								return (
									<div
										key={service.id}
										className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group border border-gray-100"
									>
										<div className="h-48 overflow-hidden">
											<img
												src={serviceImages[index % serviceImages.length]}
												alt={service.title}
												className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
											/>
										</div>

										<div className="p-6">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
													<IconComponent className="w-5 h-5 text-blue-600" />
												</div>
												<h4 className="text-lg font-bold text-blue-900">
													{service.title}
												</h4>
											</div>

											<p className="text-gray-600 text-sm leading-relaxed">
												{service.description}
											</p>
										</div>
									</div>
								);
							})}
					</div>
				</div>
			</section>

			{/* FOOTER OMITIDO POR BREVEDAD (no cambia) */}
		</div>
	);
}

export default App;
