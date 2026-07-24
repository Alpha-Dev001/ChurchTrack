import React, { useState, useRef } from "react";
import {
  ArrowLeft,
  UploadCloud,
  Trash2,
  Plus,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Check,
  AlertCircle,
  CheckCircle2,
  Wind,
  Wifi,
  Volume2,
  Tv,
  Car,
  Utensils,
  Mic,
  Zap,
  Accessibility,
  Bath,
  Flame,
  Trees,
  Save,
  Info
} from "lucide-react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { addHallSchema, AddHallFormData } from "../lib/schemas";

const tAddHall: Record<string, any> = {
  EN: {
    dashboard: "Dashboard",
    halls: "Halls",
    addNewHall: "Add New Hall",
    backToHalls: "Back to Halls",
    hallInfo: "Hall Information",
    fillDetails: "Fill in the details of the hall",
    hallName: "Hall Name",
    location: "Location",
    description: "Description",
    capacity: "Capacity",
    pricePerDay: "Price (per day)",
    securityDeposit: "Security Deposit (RWF)",
    status: "Status",
    active: "Active",
    inactive: "Inactive / Maintenance",
    dimensions: "Dimensions / Floor Size",
    operatingHours: "Operating Hours",
    amenities: "Amenities",
    selectAllApply: "Select all that apply",
    hallImages: "Hall Images",
    uploadImagesCloudinary: "Upload images — they are stored on Cloudinary when you save",
    dragDrop: "Drag & drop images here",
    or: "or",
    chooseFiles: "Choose Files",
    maxSize: "JPG, PNG or WEBP. Max 5MB each. Up to 5 images.",
    orAddUrl: "Or add image URL manually",
    addUrl: "Add URL",
    imagePreview: "Image Preview",
    noImages: "No images uploaded",
    cover: "Cover",
    addMore: "Add More",
    imageTips: "Image Tips",
    tip1: "Upload clear, bright images of the hall",
    tip2: "The first image will be used as the cover",
    tip3: "Recommended size: 1280x853 pixels or higher",
    tip4: "Images are uploaded securely to Cloudinary when you save",
    saveDraft: "Save as Draft",
    saveHall: "Save Hall",
    savingHall: "Saving Hall...",
    errName: "Please enter a valid Hall Name.",
    errImage: "Please upload at least one image of the hall."
  },
  FR: {
    dashboard: "Tableau de bord",
    halls: "Salles",
    addNewHall: "Ajouter une nouvelle salle",
    backToHalls: "Retour aux salles",
    hallInfo: "Informations sur la salle",
    fillDetails: "Remplissez les détails de la salle",
    hallName: "Nom de la salle",
    location: "Emplacement",
    description: "Description",
    capacity: "Capacité",
    pricePerDay: "Prix (par jour)",
    securityDeposit: "Dépôt de garantie (RWF)",
    status: "Statut",
    active: "Actif",
    inactive: "Inactif / En maintenance",
    dimensions: "Dimensions / Surface au sol",
    operatingHours: "Heures d'ouverture",
    amenities: "Équipements",
    selectAllApply: "Sélectionnez tout ce qui s'applique",
    hallImages: "Photos de la salle",
    uploadImagesCloudinary: "Téléchargez des images — elles seront stockées sur Cloudinary à l'enregistrement",
    dragDrop: "Glissez-déposez des images ici",
    or: "ou",
    chooseFiles: "Choisir des fichiers",
    maxSize: "JPG, PNG ou WEBP. Max 5 Mo chacun. Jusqu'à 5 images.",
    orAddUrl: "Ou ajoutez l'URL de l'image manuellement",
    addUrl: "Ajouter l'URL",
    imagePreview: "Aperçu des images",
    noImages: "Aucune image téléchargée",
    cover: "Couverture",
    addMore: "Ajouter plus",
    imageTips: "Conseils pour les images",
    tip1: "Téléchargez des images claires et lumineuses de la salle",
    tip2: "La première image sera utilisée comme couverture",
    tip3: "Taille recommandée: 1280x853 pixels ou plus",
    tip4: "Les images sont envoyées sur Cloudinary à l'enregistrement",
    saveDraft: "Enregistrer comme brouillon",
    saveHall: "Enregistrer la salle",
    savingHall: "Enregistrement...",
    errName: "Veuillez saisir un nom de salle valide.",
    errImage: "Veuillez télécharger au moins une image de la salle."
  },
  RW: {
    dashboard: "Dashboard",
    halls: "Ibyumba (Halls)",
    addNewHall: "Ongeramo Icyumba Gishya",
    backToHalls: "Subira ku Byumba",
    hallInfo: "Amakuru y'Icyumba",
    fillDetails: "Uzuza amakuru y'icyumba",
    hallName: "Izina ry'Icyumba",
    location: "Aho Giherereye",
    description: "Ibisobanuro",
    capacity: "Ubushobozi (Capacité)",
    pricePerDay: "Igiciro (ku munsi)",
    securityDeposit: "Ingwate (RWF)",
    status: "Imiterere (Status)",
    active: "Kirakora",
    inactive: "Gikora NABI / Maintenance",
    dimensions: "Uburebure n'Ubugari",
    operatingHours: "Amasaha yo Gukora",
    amenities: "Ibyangombwa bihari",
    selectAllApply: "Hitamo ibihari byose",
    hallImages: "Amofoto y'Icyumba",
    uploadImagesCloudinary: "Shyiraho amafoto — bizoherejwe kuri Cloudinary igihe ubika",
    dragDrop: "Kura foto hano uzishyire hano",
    or: "cyangwa",
    chooseFiles: "Hitamo Amafoto",
    maxSize: "JPG, PNG cyangwa WEBP. Buri foto ntirenze 5MB. Amafoto 5.",
    orAddUrl: "Cyangwa andika URL y'ifoto",
    addUrl: "Ongeraho URL",
    imagePreview: "Kureba Amafoto",
    noImages: "Nta foto irashyirwaho",
    cover: "Igifuniko (Cover)",
    addMore: "Ongeraho Ayandi",
    imageTips: "Inama ku Mafoto",
    tip1: "Shyiraho amafoto aboneye kandi arera neza",
    tip2: "Ifoto ya mbere ni yo iba cover",
    tip3: "Ingano isabwa: 1280x853 pixels cyangwa irenga",
    tip4: "Amafoto yoherezwa kuri Cloudinary igihe ubika",
    saveDraft: "Bika nka Brouillon",
    saveHall: "Bika Icyumba",
    savingHall: "Kugibika...",
    errName: "Andika izina ry'icyumba ryemewe.",
    errImage: "Shyiraho nibura ifoto imwe y'icyumba."
  }
};

interface AdminAddHallPageProps {
  lang?: string;
  onNavigate: (view: string, params?: any) => void;
  onAddHall: (hallData: any) => Promise<void>;
}

export default function AdminAddHallPage({
  lang = "EN",
  onNavigate,
  onAddHall
}: AdminAddHallPageProps) {
  const t = tAddHall[lang] || tAddHall["EN"];

  const {
    register,
    handleSubmit: handleFormSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<AddHallFormData>({
    resolver: zodResolver(addHallSchema) as Resolver<AddHallFormData>,
    defaultValues: {
      name: "",
      location: "Kacyiru, Kigali",
      description: "",
      capacity: 500,
      price: 250000,
      securityDeposit: 50000,
      status: "Active",
      workingHours: "08:00 AM - 08:00 PM",
      size: "1200 m²",
      images: []
    }
  });

  const images = watch("images") || [];

  // Amenities
  const allAmenities = [
    { id: "Air Conditioning", label: "Air Conditioning", icon: Wind },
    { id: "Wi-Fi", label: "Wi-Fi", icon: Wifi },
    { id: "Sound System", label: "Sound System", icon: Volume2 },
    { id: "Projector", label: "Projector", icon: Tv },
    { id: "Parking", label: "Parking", icon: Car },
    { id: "Catering Area", label: "Catering Area", icon: Utensils },
    { id: "Stage", label: "Stage", icon: Mic },
    { id: "Lighting", label: "Lighting", icon: Zap },
    { id: "Wheelchair Access", label: "Wheelchair Access", icon: Accessibility },
    { id: "Restrooms", label: "Restrooms", icon: Bath },
    { id: "Kitchen", label: "Kitchen", icon: Flame },
    { id: "Garden", label: "Garden", icon: Trees }
  ];

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "Air Conditioning",
    "Wi-Fi",
    "Sound System",
    "Stage",
    "Parking",
    "Restrooms"
  ]);

  const [manualImageUrl, setManualImageUrl] = useState("");

  // Upload Status State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [notification, setNotification] = useState<{ type: "success" | "error" | "info"; msg: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  // Local files queued for multipart upload to backend → Cloudinary on submit.
  const [pendingImageFiles, setPendingImageFiles] = useState<Record<string, File>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_IMAGES = 5;

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const queueImageFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(`Adding ${Math.min(files.length, remaining)} file(s)...`);
    setNotification(null);

    const newUrls: string[] = [];
    const newPending: Record<string, File> = {};
    let successCount = 0;
    const fileList = Array.from(files).slice(0, remaining);

    for (const file of fileList) {
      if (!file.type.startsWith("image/")) {
        setNotification({ type: "error", msg: `${file.name} is not an image.` });
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setNotification({
          type: "error",
          msg: `File ${file.name} exceeds 5MB limit.`
        });
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      newUrls.push(previewUrl);
      newPending[previewUrl] = file;
      successCount++;
    }

    if (newUrls.length > 0) {
      const updated = [...images, ...newUrls].slice(0, MAX_IMAGES);
      setValue("images", updated, { shouldValidate: true });
      setPendingImageFiles((prev) => ({ ...prev, ...newPending }));
      toast.success(`${successCount} image(s) ready — uploaded to Cloudinary when you save.`);
    }

    setIsUploading(false);
    setUploadProgress("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      queueImageFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleManualAddUrl = () => {
    if (!manualImageUrl.trim()) return;
    if (images.length >= MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }
    try {
      new URL(manualImageUrl.trim());
    } catch {
      toast.error("Please enter a valid image URL.");
      return;
    }
    const updated = [...images, manualImageUrl.trim()];
    setValue("images", updated, { shouldValidate: true });
    setManualImageUrl("");
    toast.success("Image URL added successfully.");
  };

  const removeImage = (index: number) => {
    const removed = images[index];
    const updated = images.filter((_, i) => i !== index);
    setValue("images", updated, { shouldValidate: true });
    if (removed && pendingImageFiles[removed]) {
      URL.revokeObjectURL(removed);
      setPendingImageFiles((prev) => {
        const next = { ...prev };
        delete next[removed];
        return next;
      });
    }
  };

  const moveImageToCover = (index: number) => {
    if (index === 0) return;
    const copy = [...images];
    const target = copy.splice(index, 1)[0];
    copy.unshift(target);
    setValue("images", copy, { shouldValidate: true });
  };

  // Formatting helper for description
  const appendFormat = (prefix: string, suffix: string = "") => {
    const currentDesc = watch("description") || "";
    setValue("description", currentDesc + `${prefix}text${suffix}`);
  };

  // Submit Handler
  const onAddSubmit = async (data: AddHallFormData, isDraft = false) => {
    setIsSubmitting(true);
    setFormError("");
    try {
      if (!data.images?.length) {
        throw new Error(t.errImage);
      }

      const remoteImages = data.images.filter(
        (url) => !url.startsWith("blob:") && !url.startsWith("data:")
      );
      const imageFiles = data.images
        .map((url) => pendingImageFiles[url])
        .filter((file): file is File => Boolean(file));

      if (remoteImages.length === 0 && imageFiles.length === 0) {
        throw new Error(t.errImage);
      }

      await onAddHall({
        name: data.name,
        location: data.location,
        description: data.description || `${data.name} is a modern, fully equipped hall in ${data.location}.`,
        capacity: Number(data.capacity),
        price: Number(data.price),
        securityDeposit: Number(data.securityDeposit || 0),
        status: isDraft ? "Inactive" : data.status,
        images: remoteImages,
        imageFiles,
        facilities: selectedAmenities,
        workingHours: data.workingHours || "08:00 AM - 08:00 PM",
        size: data.size || "1200 m²"
      });

      Object.keys(pendingImageFiles).forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });

      toast.success("Hall added successfully!");
      onNavigate("admin-halls");
    } catch (err: any) {
      const message = err.message || "Failed to create hall. Please check network connection.";
      setFormError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans text-navy-800 text-left max-w-7xl mx-auto pb-12" id="admin-add-hall-page">
      {/* Top Breadcrumb & Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-navy-400 mb-1">
            <span className="hover:text-navy-600 cursor-pointer" onClick={() => onNavigate("admin-dashboard")}>
              {t.dashboard}
            </span>
            <span>/</span>
            <span className="hover:text-navy-600 cursor-pointer" onClick={() => onNavigate("admin-halls")}>
              {t.halls}
            </span>
            <span>/</span>
            <span className="text-navy-900 font-bold">{t.addNewHall}</span>
          </div>
          <h1 className="text-2xl font-black text-navy-950 tracking-tight">{t.addNewHall}</h1>
        </div>

        <button
          onClick={() => onNavigate("admin-halls")}
          className="inline-flex items-center gap-2 bg-white hover:bg-navy-50 text-navy-700 text-xs font-bold px-4 py-2.5 rounded-lg border border-navy-200 shadow-sm transition cursor-pointer self-start sm:self-auto"
          id="btn-back-to-halls"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToHalls}</span>
        </button>
      </div>

      {/* Error alert */}
      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-3 text-xs font-bold">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Main 2-Column Grid */}
      <form onSubmit={handleFormSubmit((data) => onAddSubmit(data, false))} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT COLUMN: Hall Information */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-navy-200/90 rounded-lg p-6 sm:p-7 shadow-sm space-y-5">
            <div className="border-b border-navy-100 pb-4">
              <h2 className="text-base font-black text-navy-900">{t.hallInfo}</h2>
              <p className="text-xs text-navy-500 font-medium mt-0.5">{t.fillDetails}</p>
            </div>

            {/* Hall Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-700 flex items-center gap-1">
                <span>{t.hallName}</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Grace Hall"
                {...register("name")}
                className={`w-full px-4 py-2.5 bg-navy-50/70 border rounded-lg text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:bg-white transition ${errors.name ? "border-red-400 focus:ring-red-500/20" : "border-navy-200 focus:ring-navy-900"}`}
                id="input-hall-name"
              />
              {errors.name && (
                <p className="text-red-500 text-[11px] font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.name.message}</span>
                </p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-700 flex items-center gap-1">
                <span>{t.location}</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Kacyiru, Kigali"
                {...register("location")}
                className={`w-full px-4 py-2.5 bg-navy-50/70 border rounded-lg text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:bg-white transition ${errors.location ? "border-red-400 focus:ring-red-500/20" : "border-navy-200 focus:ring-navy-900"}`}
                id="input-hall-location"
              />
              {errors.location && (
                <p className="text-red-500 text-[11px] font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.location.message}</span>
                </p>
              )}
            </div>

            {/* Description Editor Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-700 flex items-center gap-1">
                <span>{t.description}</span>
              </label>
              <div className="border border-navy-200 rounded-lg overflow-hidden bg-navy-50/50 focus-within:ring-2 focus-within:ring-navy-900 focus-within:bg-white transition">
                {/* Editor Toolbar */}
                <div className="flex items-center gap-1 bg-navy-100/80 px-3 py-1.5 border-b border-navy-200 text-navy-600">
                  <button
                    type="button"
                    onClick={() => appendFormat("**", "**")}
                    className="p-1 hover:bg-navy-200 rounded text-navy-700 transition"
                    title="Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => appendFormat("*", "*")}
                    className="p-1 hover:bg-navy-200 rounded text-navy-700 transition"
                    title="Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-px h-4 bg-navy-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => appendFormat("\n- ")}
                    className="p-1 hover:bg-navy-200 rounded text-navy-700 transition"
                    title="Bulleted List"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => appendFormat("\n1. ")}
                    className="p-1 hover:bg-navy-200 rounded text-navy-700 transition"
                    title="Numbered List"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => appendFormat("[Link Title](https://)")}
                    className="p-1 hover:bg-navy-200 rounded text-navy-700 transition"
                    title="Insert Link"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  rows={4}
                  placeholder="Describe the hall, its features, and what makes it special..."
                  {...register("description")}
                  className="w-full px-4 py-3 bg-transparent text-xs font-semibold text-navy-900 focus:outline-none resize-y"
                  id="textarea-description"
                />
              </div>
            </div>

            {/* Capacity & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy-700 flex items-center gap-1">
                  <span>{t.capacity}</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  {...register("capacity")}
                  className={`w-full px-4 py-2.5 bg-navy-50/70 border rounded-lg text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:bg-white transition ${errors.capacity ? "border-red-400 focus:ring-red-500/20" : "border-navy-200 focus:ring-navy-900"}`}
                  id="input-capacity"
                />
                {errors.capacity && (
                  <p className="text-red-500 text-[11px] font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.capacity.message}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy-700 flex items-center gap-1">
                  <span>{t.pricePerDay}</span>
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-black text-navy-400">RWF</span>
                  <input
                    type="number"
                    placeholder="e.g. 250000"
                    {...register("price")}
                    className={`w-full pl-12 pr-4 py-2.5 bg-navy-50/70 border rounded-lg text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:bg-white transition ${errors.price ? "border-red-400 focus:ring-red-500/20" : "border-navy-200 focus:ring-navy-900"}`}
                    id="input-price"
                  />
                </div>
                {errors.price && (
                  <p className="text-red-500 text-[11px] font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.price.message}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Security Deposit & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy-700">{t.securityDeposit}</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  {...register("securityDeposit")}
                  className="w-full px-4 py-2.5 bg-navy-50/70 border border-navy-200 rounded-lg text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white transition"
                  id="input-security-deposit"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy-700 flex items-center gap-1">
                  <span>{t.status}</span>
                  <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("status")}
                  className="w-full px-4 py-2.5 bg-navy-50/70 border border-navy-200 rounded-lg text-xs font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white transition"
                  id="select-status"
                >
                  <option value="Active">{t.active}</option>
                  <option value="Inactive">{t.inactive}</option>
                </select>
              </div>
            </div>

            {/* Size & Working Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy-700">{t.dimensions}</label>
                <input
                  type="text"
                  placeholder="e.g. 1200 m²"
                  {...register("size")}
                  className="w-full px-4 py-2.5 bg-navy-50/70 border border-navy-200 rounded-lg text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy-700">{t.operatingHours}</label>
                <input
                  type="text"
                  placeholder="e.g. 08:00 AM - 08:00 PM"
                  {...register("workingHours")}
                  className="w-full px-4 py-2.5 bg-navy-50/70 border border-navy-200 rounded-lg text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Amenities Section */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-navy-700 block">{t.amenities}</label>
                <span className="text-[11px] text-navy-400 font-medium">{t.selectAllApply}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {allAmenities.map(item => {
                  const IconComp = item.icon;
                  const isChecked = selectedAmenities.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleAmenity(item.id)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold border transition cursor-pointer text-left ${isChecked
                        ? "bg-navy-900 border-navy-900 text-white shadow-sm"
                        : "bg-navy-50/80 border-navy-200 text-navy-600 hover:bg-navy-100 hover:border-navy-300"
                        }`}
                    >
                      <div className={`p-1 rounded-lg ${isChecked ? "bg-navy-800 text-navy-400" : "bg-navy-200/60 text-navy-500"}`}>
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{item.label}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 ml-auto shrink-0 text-navy-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Hall Images & Cloudinary Upload */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-navy-200/90 rounded-lg p-6 sm:p-7 shadow-sm space-y-6">
            <div className="border-b border-navy-100 pb-4">
              <h2 className="text-base font-black text-navy-900">{t.hallImages}</h2>
              <p className="text-xs text-navy-500 font-medium mt-0.5">{t.uploadImagesCloudinary}</p>
            </div>

            {/* Notification Banner */}
            {notification && (
              <div
                className={`p-3 rounded-lg text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in duration-150 ${notification.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : notification.type === "error"
                    ? "bg-red-50 text-red-800 border border-red-200"
                    : "bg-navy-50 text-navy-800 border border-navy-200"
                  }`}
              >
                <div className="flex items-center gap-2">
                  {notification.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  )}
                  <span>{notification.msg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setNotification(null)}
                  className="text-navy-400 hover:text-navy-600"
                >
                  &times;
                </button>
              </div>
            )}

            {/* Drag and Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-3 group ${isUploading
                ? "border-navy-400 bg-navy-50/50"
                : "border-navy-200 hover:border-navy-900 bg-navy-50/50 hover:bg-navy-100/50"
                }`}
              id="cloudinary-drop-zone"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={e => {
                  if (e.target.files) queueImageFiles(e.target.files);
                }}
              />

              <div className="p-3 bg-white rounded-lg shadow-sm border border-navy-100 group-hover:scale-110 transition duration-200">
                <UploadCloud className={`w-8 h-8 ${isUploading ? "text-navy-500 animate-bounce" : "text-navy-700"}`} />
              </div>

              <div>
                <p className="text-xs font-black text-navy-900">
                  {isUploading ? uploadProgress : t.dragDrop}
                </p>
                <p className="text-[11px] text-navy-400 font-semibold mt-0.5">{t.or}</p>
              </div>

              <button
                type="button"
                disabled={isUploading}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-black px-4 py-2 rounded-lg shadow transition cursor-pointer"
              >
                {t.chooseFiles}
              </button>

              <p className="text-[10px] text-navy-400 font-medium">
                {t.maxSize}
              </p>
            </div>

            {/* Manual URL Input Fallback */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-bold text-navy-500 block">{t.orAddUrl}</label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="https://res.cloudinary.com/.../image.jpg"
                  value={manualImageUrl}
                  onChange={e => setManualImageUrl(e.target.value)}
                  className="flex-1 px-3 py-2 bg-navy-50 border border-navy-200 rounded-lg text-xs font-semibold text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-900"
                />
                <button
                  type="button"
                  onClick={handleManualAddUrl}
                  className="bg-navy-200 hover:bg-navy-300 text-navy-800 text-xs font-bold px-3 py-2 rounded-lg transition cursor-pointer shrink-0"
                >
                  {t.addUrl}
                </button>
              </div>
            </div>

            {/* Image Preview Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-navy-700">
                <span>{t.imagePreview} ({images.length}/{MAX_IMAGES})</span>
                <span className="text-[11px] text-navy-400 font-medium">
                  {images.length > 0 ? `#1 is ${t.cover}` : t.noImages}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" id="image-preview-grid">
                {images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-lg overflow-hidden border border-navy-200 aspect-[4/3] bg-navy-100 shadow-sm"
                  >
                    <img
                      src={imgUrl}
                      alt={`Hall preview ${idx + 1}`}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />

                    {/* Number Badge */}
                    <div className="absolute top-2 left-2 bg-navy-950/80 backdrop-blur-sm text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                      {idx + 1}
                    </div>

                    {/* Cover Label on first image */}
                    {idx === 0 && (
                      <span className="absolute bottom-2 left-2 bg-navy-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                        {t.cover}
                      </span>
                    )}

                    {/* Action Overlay */}
                    <div className="absolute inset-0 bg-navy-950/40 opacity-0 group-hover:opacity-100 transition duration-150 flex items-center justify-center gap-2">
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => moveImageToCover(idx)}
                          className="p-1.5 bg-white text-navy-800 text-[10px] font-bold rounded-lg hover:bg-navy-500 hover:text-white transition shadow"
                          title="Set as cover image"
                        >
                          {t.cover}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="p-1.5 bg-white/90 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition shadow"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add More Tile */}
                {images.length < MAX_IMAGES && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-navy-200 hover:border-navy-900 rounded-lg aspect-[4/3] flex flex-col items-center justify-center text-navy-400 hover:text-navy-900 transition bg-navy-50/50 hover:bg-navy-100/50 cursor-pointer"
                  >
                    <Plus className="w-6 h-6 mb-1" />
                    <span className="text-[11px] font-bold">{t.addMore}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Image Tips Box */}
            <div className="bg-navy-50/70 border border-navy-100 rounded-lg p-4 text-xs space-y-2 text-navy-950">
              <div className="flex items-center gap-2 font-black text-navy-900">
                <Info className="w-4 h-4 text-navy-600" />
                <span>{t.imageTips}</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-navy-800 font-medium leading-relaxed">
                <li>{t.tip1}</li>
                <li>{t.tip2}</li>
                <li>{t.tip3}</li>
                <li>{t.tip4}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="lg:col-span-12 flex items-center justify-end gap-3 pt-4 border-t border-navy-200">
          <button
            type="button"
            onClick={() => handleFormSubmit((data) => onAddSubmit(data, true))()}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-lg border border-navy-200 hover:bg-navy-100 text-navy-800 text-xs font-bold transition cursor-pointer"
          >
            {t.saveDraft}
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 bg-navy-950 hover:bg-navy-800 text-white text-xs font-black px-8 py-3 rounded-lg shadow-lg transition cursor-pointer disabled:opacity-50"
            id="btn-save-hall"
          >
            <Save className="w-4 h-4 text-navy-400" />
            <span>{isSubmitting ? t.savingHall : t.saveHall}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
