import React, { useEffect, useRef, useState } from 'react';
import MainCard from '../../components/cards/MainCard';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';
import axios from '../../api/axios';
import { getCsrfToken } from '../../utils/global';
import TextArea from '../../components/form/input/TextArea';

type Slider = {
    id: number;
    title: string;
    description: string;
    image: string;
};

type SliderFormData = {
    title: string;
    description: string;
    image: File | null;
};

export default function SliderForm() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [formData, setFormData] = useState<SliderFormData>({
        title: '',
        description: '',
        image: null,
    });

    const [preview, setPreview] = useState<string | null>(null);
    const [sliders, setSliders] = useState<Slider[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // Fetch sliders from backend
    const fetchSliders = async () => {
        try {
            const res = await axios.get('/slider/');
            // Ensure URL is absolute and correct
            const updatedData = res.data.map((s: Slider) => ({
                ...s,
                image: s.image.startsWith('http') ? s.image : `${window.location.origin}${s.image}`,
            }));
            setSliders(updatedData);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSliders();
    }, []);

    // Handle image selection + preview
    const handleImageChange = (file: File | null) => {
        if (!file) return;
        setFormData({ ...formData, image: file });

        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    // Delete slider and reload table
    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this slider?')) return;
        setLoading(true);
        try {
            await axios.delete(`/slider/delete/${id}/`, {
                headers: { 'X-CSRFToken': getCsrfToken() },
            });
            fetchSliders(); // reload table
            setLoading(false);
        } catch (err) {
            console.error('Delete failed', err);
        }
    };

    // Form validation
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) newErrors.title = 'Title is required';
        else if (formData.title.length < 3) newErrors.title = 'Title must be at least 3 characters';

        if (!formData.description.trim()) newErrors.description = 'Description is required';
        else if (formData.description.length < 10)
            newErrors.description = 'Description must be at least 10 characters';

        if (!formData.image) newErrors.image = 'Image is required';
        else if (formData.image.size > 5 * 1024 * 1024) newErrors.image = 'Image must be less than 5MB';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', image: null });
        setPreview(null);
        setErrors({});
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Submit slider
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            if (formData.image) formDataToSend.append('image', formData.image);

            await axios.post('/slider/add/', formDataToSend, {
                headers: { 'X-CSRFToken': getCsrfToken(), 'Content-Type': 'multipart/form-data' },
            });

            resetForm();
            fetchSliders();
        } catch (error) {
            console.error(error);
            setErrors({ submit: 'Failed to submit form' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainCard cardtitle="Slider Management">
            {/* FORM */}
            <form className="grid grid-cols-2 gap-6 mb-10" onSubmit={handleSubmit}>
                {loading && <p className="col-span-2 text-center text-blue-500">loading...</p>}
                {/* Title */}
                <div>
                    <Input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Title"
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                </div>

                {/* Image */}
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                        className="w-full border p-2 rounded"
                    />
                    {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                </div>

                {/* Preview */}
                {preview && (
                    <div className="col-span-2">
                        <img src={preview} alt="Preview" className="h-32 rounded border" />
                    </div>
                )}

                {/* Description */}
                <div className="col-span-2">
                    <TextArea
                        value={formData.description}
                        onChange={(val: string) => setFormData({ ...formData, description: val })}
                        placeholder="Description"
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                </div>

                {errors.submit && <p className="col-span-2 text-red-500">{errors.submit}</p>}

                <div className="col-span-2 flex justify-center">
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </Button>
                </div>
            </form>

            {/* TABLE */}
            <div className="overflow-x-auto">
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Image</th>
                            <th className="p-2 border">Title</th>
                            <th className="p-2 border">Description</th>
                            <th className="p-2 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sliders.map((item) => (
                            <tr key={item.id} className='text-center'>
                                <td className="p-2 border flex justify-center">
                                    <img src={item.image} alt={item.title} className="h-16 rounded-full" />
                                </td>
                                <td className="p-2 border">{item.title}</td>
                                <td className="p-2 border">{item.description}</td>
                                <td className="p-2 border text-center">
                                    <Button onClick={() => handleDelete(item.id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                        {sliders.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center p-4">
                                    loading records...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </MainCard>
    );
}
