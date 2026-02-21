import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Upload, FileText, CreditCard, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

const API_BASE = 'http://localhost:3000/api';

/**
 * DocumentUpload — Page for uploading Permis de Conduire & CIN.
 * Accessed via a unique link sent in the WhatsApp confirmation message.
 * Files are uploaded to the server via multipart/form-data.
 */
const DocumentUpload = () => {
    const { reservationId } = useParams();

    const [files, setFiles] = useState({
        permis: null,
        cin: null,
    });
    const [previews, setPreviews] = useState({
        permis: null,
        cin: null,
    });
    const [submitted, setSubmitted] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (type, event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Le fichier est trop volumineux. Taille maximale : 5 MB.');
            return;
        }

        setFiles(prev => ({ ...prev, [type]: file }));
        setError(null);

        // Generate preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviews(prev => ({ ...prev, [type]: e.target.result }));
            };
            reader.readAsDataURL(file);
        } else {
            setPreviews(prev => ({ ...prev, [type]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!files.permis || !files.cin) {
            setError('Veuillez sélectionner les deux documents avant de soumettre.');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('permis', files.permis);
            formData.append('cin', files.cin);

            const res = await fetch(`${API_BASE}/uploads/${reservationId}`, {
                method: 'POST',
                body: formData,
                // No Content-Type header — browser sets multipart boundary automatically
            });

            const json = await res.json();

            if (!res.ok) {
                setError(json.message || 'Erreur lors du téléchargement.');
                return;
            }

            setSubmitted(true);
        } catch (err) {
            setError('Erreur réseau. Vérifiez votre connexion et réessayez.');
        } finally {
            setUploading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center py-24 px-4">
                <div className="bg-white border border-zinc-200 shadow-xl max-w-md w-full p-10 text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={32} className="text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-900 font-display mb-3">Documents Soumis</h2>
                    <p className="text-zinc-500 font-light mb-6">
                        Vos documents pour la réservation <strong>#{reservationId}</strong> ont été envoyés avec succès.
                        Notre équipe les vérifiera sous 24h.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-zinc-950 text-white px-6 py-3 hover:bg-red-600 transition-colors font-medium"
                    >
                        <ArrowLeft size={18} /> Retour à l'accueil
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 py-24 px-4">
            <div className="container mx-auto max-w-2xl">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-red-600 flex items-center justify-center">
                            <Upload size={20} className="text-white" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 font-display uppercase tracking-tight">
                            Dépôt de Documents
                        </h1>
                    </div>
                    <p className="text-zinc-500 font-light">
                        Réservation <strong>#{reservationId}</strong> — Veuillez télécharger votre permis de conduire et votre CIN.
                    </p>
                </div>

                {/* Info Alert */}
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 mb-6 flex items-start gap-3 text-sm">
                    <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
                    <div>
                        <strong>Important :</strong> Les documents doivent être lisibles et en format image (JPG, PNG) ou PDF.
                        Taille maximale : 5 MB par fichier.
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 flex items-start gap-2 text-sm">
                        <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Upload Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Permis de Conduire */}
                    <div className="bg-white border border-zinc-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <CreditCard size={20} className="text-red-600" />
                            <h2 className="font-bold text-zinc-900 uppercase tracking-wide text-sm">
                                Permis de Conduire
                            </h2>
                        </div>

                        <label className="block cursor-pointer">
                            <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${files.permis
                                ? 'border-emerald-300 bg-emerald-50/50'
                                : 'border-zinc-300 hover:border-red-400 hover:bg-red-50/30'
                                }`}>
                                {previews.permis ? (
                                    <img src={previews.permis} alt="Permis preview" className="max-h-40 mx-auto mb-3 rounded shadow-sm" />
                                ) : (
                                    <FileText size={40} className="mx-auto mb-3 text-zinc-300" />
                                )}
                                <p className="text-sm text-zinc-600">
                                    {files.permis
                                        ? <span className="text-emerald-700 font-medium">✓ {files.permis.name}</span>
                                        : 'Cliquez pour sélectionner votre permis de conduire'
                                    }
                                </p>
                            </div>
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                onChange={(e) => handleFileChange('permis', e)}
                            />
                        </label>
                    </div>

                    {/* CIN */}
                    <div className="bg-white border border-zinc-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <CreditCard size={20} className="text-red-600" />
                            <h2 className="font-bold text-zinc-900 uppercase tracking-wide text-sm">
                                Carte d'Identité Nationale (CIN)
                            </h2>
                        </div>

                        <label className="block cursor-pointer">
                            <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${files.cin
                                ? 'border-emerald-300 bg-emerald-50/50'
                                : 'border-zinc-300 hover:border-red-400 hover:bg-red-50/30'
                                }`}>
                                {previews.cin ? (
                                    <img src={previews.cin} alt="CIN preview" className="max-h-40 mx-auto mb-3 rounded shadow-sm" />
                                ) : (
                                    <FileText size={40} className="mx-auto mb-3 text-zinc-300" />
                                )}
                                <p className="text-sm text-zinc-600">
                                    {files.cin
                                        ? <span className="text-emerald-700 font-medium">✓ {files.cin.name}</span>
                                        : 'Cliquez pour sélectionner votre CIN'
                                    }
                                </p>
                            </div>
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                onChange={(e) => handleFileChange('cin', e)}
                            />
                        </label>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!files.permis || !files.cin || uploading}
                        className={`w-full bg-zinc-950 text-white font-bold py-4 shadow-lg hover:bg-red-600 hover:shadow-red-600/30 transition-all duration-300 skew-x-[-5deg] ${(!files.permis || !files.cin || uploading) ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        <span className="skew-x-[5deg] flex items-center justify-center gap-2">
                            {uploading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                    Envoi en cours...
                                </>
                            ) : (
                                <>
                                    <Upload size={18} /> Soumettre les Documents
                                </>
                            )}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DocumentUpload;
