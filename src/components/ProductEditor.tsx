import { useMemo, useRef, useState } from "react";
import { Check, ImagePlus, Loader2, Star, Upload, X } from "lucide-react";
import { saveProduct, useStore, type ProductInput } from "@/lib/store";
import type { Badge, Category, Silhouette } from "@/lib/catalog";
import { compressImageFile, isUsableImageUrl } from "@/lib/images";
import { notify } from "@/lib/ui-store";
import { DenimArt } from "@/components/DenimArt";
import { btn } from "@/components/ui";
import { cn, inr } from "@/lib/utils";

export type Draft = { id?: string; input: ProductInput };

export const emptyProductInput: ProductInput = {
  name: "",
  category: "Jeans",
  fit: "Slim",
  wash: "Rinse Indigo",
  silhouette: "jeans",
  palette: { base: "#2B4463", light: "#4F7093", deep: "#16283A" },
  price: 2499,
  mrp: 3299,
  stock: 12,
  sizes: ["28", "30", "32", "34", "36", "38"],
  badge: "New",
  story: "",
  details: [],
  featured: false,
  images: [],
};

const MAX_IMAGES = 6;

const SIZE_PRESETS = [
  { label: "Denim 28–38", sizes: ["28", "30", "32", "34", "36", "38"] },
  { label: "Tops S–XXL", sizes: ["S", "M", "L", "XL", "XXL"] },
  { label: "One size", sizes: ["One size"] },
];

const WASH_PRESETS = [
  { name: "Rinse", palette: { base: "#2B4463", light: "#4F7093", deep: "#16283A" } },
  { name: "Stone", palette: { base: "#6E8AA5", light: "#A2B8CB", deep: "#40576E" } },
  { name: "Raw", palette: { base: "#22364F", light: "#3F5E7E", deep: "#0F1D2A" } },
  { name: "Black", palette: { base: "#26262B", light: "#41414A", deep: "#111114" } },
  { name: "Ecru", palette: { base: "#CDBFA6", light: "#E7DCC8", deep: "#A08F73" } },
];

const CATEGORY_SILHOUETTE: Record<Category, Silhouette> = {
  Jeans: "jeans",
  Jackets: "jacket",
  Cargo: "cargo",
  Shirts: "shirt",
};

function parseSizes(value: string) {
  return value
    .split(",")
    .map((size) => size.trim())
    .filter(Boolean);
}

export function ProductEditor({ draft, onClose }: { draft: Draft; onClose: () => void }) {
  const state = useStore();
  const [form, setForm] = useState<ProductInput>(draft.input);
  const [sizeText, setSizeText] = useState(draft.input.sizes.join(", "));
  const [detailText, setDetailText] = useState(draft.input.details.join("\n"));
  const [imageUrl, setImageUrl] = useState("");
  const [imageBusy, setImageBusy] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const patch = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key as string]) return current;
      const next = { ...current };
      delete next[key as string];
      return next;
    });
  };

  const cover = form.images[0];
  const discount = form.mrp > form.price ? Math.round(((form.mrp - form.price) / form.mrp) * 100) : 0;
  const parsedSizes = parseSizes(sizeText);
  const full = form.images.length >= MAX_IMAGES;

  const libraryPhotos = useMemo(() => {
    const seen = new Set(form.images);
    const photos: { src: string; label: string }[] = [];
    for (const product of state.products) {
      for (const src of product.images) {
        if (seen.has(src)) continue;
        seen.add(src);
        photos.push({ src, label: product.name });
      }
    }
    return photos;
  }, [state.products, form.images]);

  const handleFiles = async (files: FileList | File[] | null) => {
    if (!files) return;
    const list = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (list.length === 0) {
      setImageError("Those files aren't photos — use JPG, PNG or WebP.");
      return;
    }
    const room = MAX_IMAGES - form.images.length;
    if (room <= 0) {
      setImageError("Six photos is the maximum — remove one first.");
      return;
    }
    setImageError(null);
    setImageBusy(true);
    try {
      const encoded: string[] = [];
      for (const file of list.slice(0, room)) {
        encoded.push(await compressImageFile(file));
      }
      setForm((current) => ({ ...current, images: [...current.images, ...encoded].slice(0, MAX_IMAGES) }));
      notify(`${encoded.length} photo${encoded.length === 1 ? "" : "s"} added`);
    } catch (error) {
      setImageError((error as Error).message);
    } finally {
      setImageBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const addImageUrl = () => {
    if (!isUsableImageUrl(imageUrl)) {
      setImageError("Paste a full https:// image link, or upload a file.");
      return;
    }
    if (full) {
      setImageError("Six photos is the maximum — remove one first.");
      return;
    }
    setForm((current) => ({ ...current, images: [...current.images, imageUrl.trim()].slice(0, MAX_IMAGES) }));
    setImageUrl("");
    setImageError(null);
  };

  const addLibraryPhoto = (src: string) => {
    if (full) {
      setImageError("Six photos is the maximum — remove one first.");
      return;
    }
    if (form.images.includes(src)) return;
    setForm((current) => ({ ...current, images: [...current.images, src].slice(0, MAX_IMAGES) }));
    setImageError(null);
  };

  const makeCover = (index: number) => {
    setForm((current) => {
      const images = [...current.images];
      const [picked] = images.splice(index, 1);
      return { ...current, images: [picked, ...images] };
    });
  };

  const removeImage = (index: number) => {
    setForm((current) => ({ ...current, images: current.images.filter((_, i) => i !== index) }));
  };

  const onPaste = (event: React.ClipboardEvent) => {
    const files = Array.from(event.clipboardData.files).filter((file) => file.type.startsWith("image/"));
    if (files.length === 0) return;
    event.preventDefault();
    void handleFiles(files);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = "Give the style a name";
    if (form.price <= 0) nextErrors.price = "Price must be greater than zero";
    if (form.mrp < form.price) nextErrors.mrp = "MRP can't be below the selling price";
    if (form.stock < 0) nextErrors.stock = "Stock can't be negative";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      notify("Check the highlighted fields");
      return;
    }

    saveProduct(
      {
        ...form,
        name: form.name.trim(),
        sizes: parsedSizes.length ? parsedSizes : ["S", "M", "L", "XL"],
        details: detailText
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        badge: form.badge || undefined,
        images: form.images.slice(0, MAX_IMAGES),
      },
      draft.id,
    );
    notify(draft.id ? `${form.name.trim()} updated` : `${form.name.trim()} published to the shop`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-black/80 backdrop-blur-sm sm:p-6">
      <div className="mx-auto w-full max-w-5xl border border-line bg-paper shadow-lift">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-label text-muted">
              {draft.id ? "Editing style" : "New style"} · inventory desk
            </p>
            <h2 className="truncate font-display text-xl font-bold sm:text-2xl">
              {draft.id ? draft.input.name || "Untitled" : "Add a product"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close editor"
            className="grid h-9 w-9 shrink-0 place-items-center border border-line text-muted transition-colors hover:border-ink hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="flex flex-col">
          <div className="grid lg:grid-cols-[1.45fr_1fr]">
            {/* live preview */}
            <aside className="order-first border-b border-line bg-cream px-5 py-5 lg:order-none lg:border-b-0 lg:border-l">
              <div className="flex items-center justify-between">
                <p className="label">Live preview</p>
                <span className="text-[9px] uppercase tracking-label text-muted/70">Updates as you type</span>
              </div>

              <div className="mt-3 border border-line bg-paper">
                <div className="flex gap-3 p-3 lg:block lg:p-0">
                  <div className="h-28 w-24 shrink-0 overflow-hidden bg-cream lg:aspect-[4/5] lg:h-auto lg:w-full">
                    {cover ? (
                      <img src={cover} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <DenimArt palette={form.palette} silhouette={form.silhouette} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 lg:p-3">
                    <p className="truncate text-[9px] uppercase tracking-label text-muted">
                      {form.fit || "Fit"} · {form.wash || "Wash"}
                    </p>
                    <p className="mt-1 truncate font-display text-lg font-semibold leading-tight">
                      {form.name || "Untitled style"}
                    </p>
                    <div className="mt-1 flex flex-wrap items-baseline gap-2">
                      <span className="text-sm font-medium">{inr(form.price || 0)}</span>
                      {discount > 0 && (
                        <>
                          <span className="text-[11px] text-muted line-through">{inr(form.mrp)}</span>
                          <span className="text-[9px] font-semibold uppercase tracking-label text-red">-{discount}%</span>
                        </>
                      )}
                    </div>
                    <p className="mt-1 text-[10px] text-muted">
                      {form.stock > 0 ? `${form.stock} in stock` : "Sold out"}
                      {form.featured ? " · Featured" : ""}
                    </p>
                    {parsedSizes.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {parsedSizes.slice(0, 8).map((size) => (
                          <span key={size} className="border border-line px-1.5 py-0.5 text-[9px] text-muted">
                            {size}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <ul className="mt-3 space-y-1.5 text-[10px] text-muted">
                <li className="flex items-center gap-2">
                  <Check className={cn("h-3 w-3", form.images.length > 0 ? "text-red" : "text-muted/50")} />
                  {form.images.length > 0
                    ? `${form.images.length} of ${MAX_IMAGES} photos attached`
                    : "No photos yet — artwork will be used"}
                </li>
                <li className="flex items-center gap-2">
                  <Check className={cn("h-3 w-3", parsedSizes.length > 0 ? "text-red" : "text-muted/50")} />
                  {parsedSizes.length} size{parsedSizes.length === 1 ? "" : "s"}
                </li>
              </ul>
            </aside>

            {/* form */}
            <div className="order-last space-y-8 px-5 py-6 sm:px-6">
              {/* 01 photos */}
              <section className="space-y-4">
                <div className="flex items-baseline justify-between gap-3 border-b border-line pb-2.5">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-sm font-bold text-red">01</span>
                    <h3 className="font-display text-base font-semibold">Photos</h3>
                  </div>
                  <span className="text-[9px] uppercase tracking-label text-muted">
                    {form.images.length}/{MAX_IMAGES}
                  </span>
                </div>

                <div
                  tabIndex={0}
                  onPaste={onPaste}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setDragging(false);
                    void handleFiles(event.dataTransfer.files);
                  }}
                  className={cn(
                    "relative border border-dashed p-4 transition-colors outline-none",
                    dragging ? "border-red bg-red/5" : "border-line bg-cream focus:border-ink",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center bg-red text-white">
                      {imageBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12.5px] font-semibold">
                        {imageBusy ? "Adding photos…" : full ? "Photo limit reached" : "Drop photos here"}
                      </p>
                      <p className="mt-0.5 text-[10px] leading-relaxed text-muted">
                        {full
                          ? "Remove a photo below to add another."
                          : "Click to browse, drag files in, or paste with ⌘/Ctrl + V. JPG, PNG or WebP — resized to 1200px."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={imageBusy || full}
                      className={btn("primary", "sm", "disabled:opacity-40")}
                    >
                      <ImagePlus className="h-3.5 w-3.5" /> Add photos
                    </button>
                  </div>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={(event) => void handleFiles(event.target.files)}
                  />
                </div>

                {form.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {form.images.map((src, index) => (
                      <div
                        key={`${src.slice(-24)}-${index}`}
                        className="relative aspect-[4/5] overflow-hidden border border-line bg-cream"
                      >
                        <img src={src} alt="" className="h-full w-full object-cover" />
                        {index === 0 && (
                          <span className="absolute left-1 top-1 bg-red px-1.5 py-0.5 text-[7.5px] font-semibold uppercase tracking-[0.12em] text-white">
                            Cover
                          </span>
                        )}
                        <div className="absolute inset-x-0 bottom-0 flex">
                          {index !== 0 && (
                            <button
                              type="button"
                              onClick={() => makeCover(index)}
                              className="flex flex-1 items-center justify-center gap-1 bg-black/70 py-1.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-black"
                            >
                              <Star className="h-2.5 w-2.5" /> Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            aria-label="Remove photo"
                            className="grid w-7 place-items-center bg-black/70 py-1.5 text-white transition-colors hover:bg-red"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {!full && (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        disabled={imageBusy}
                        className="flex aspect-[4/5] flex-col items-center justify-center gap-1.5 border border-dashed border-line text-muted transition-colors hover:border-ink hover:text-ink disabled:opacity-60"
                      >
                        {imageBusy ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
                        <span className="text-[8.5px] font-semibold uppercase tracking-label">Upload</span>
                      </button>
                    )}
                  </div>
                )}

                {libraryPhotos.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="label">Reuse a catalogue photo</span>
                      <button
                        type="button"
                        onClick={() => setLibraryOpen((open) => !open)}
                        className="text-[9.5px] uppercase tracking-label text-muted transition-colors hover:text-red"
                      >
                        {libraryOpen ? "Hide" : "Browse"}
                      </button>
                    </div>
                    {libraryOpen && (
                      <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
                        {libraryPhotos.map((photo) => (
                          <button
                            key={photo.src}
                            type="button"
                            onClick={() => addLibraryPhoto(photo.src)}
                            title={photo.label}
                            className="group relative h-20 w-16 shrink-0 overflow-hidden border border-line bg-cream transition-colors hover:border-red"
                          >
                            <img src={photo.src} alt={photo.label} className="h-full w-full object-cover" />
                            <span className="absolute inset-x-0 bottom-0 truncate bg-black/70 px-1 py-0.5 text-[7px] uppercase tracking-[0.1em] text-white/80">
                              {photo.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {!full && (
                  <div className="flex gap-2">
                    <input
                      value={imageUrl}
                      onChange={(event) => setImageUrl(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addImageUrl();
                        }
                      }}
                      placeholder="or paste an image URL"
                      className="field py-2 text-[12px]"
                    />
                    <button
                      type="button"
                      onClick={addImageUrl}
                      className="shrink-0 border border-line px-3 text-[9px] font-semibold uppercase tracking-label transition-colors hover:border-ink"
                    >
                      Add
                    </button>
                  </div>
                )}

                {imageError && <p className="text-[10px] text-red">{imageError}</p>}
                <p className="text-[10px] leading-relaxed text-muted">
                  First photo becomes the cover on the shop grid. Uploads are compressed and stored in this browser.
                </p>
              </section>

              {/* 02 basics */}
              <section className="space-y-4">
                <div className="flex items-baseline gap-3 border-b border-line pb-2.5">
                  <span className="font-display text-sm font-bold text-red">02</span>
                  <h3 className="font-display text-base font-semibold">Basics</h3>
                </div>

                <label className="block">
                  <span className="label">Product name *</span>
                  <input
                    value={form.name}
                    onChange={(event) => patch("name", event.target.value)}
                    placeholder="e.g. The Ashford Slim"
                    className="field"
                  />
                  {errors.name && <span className="mt-1 block text-[10px] text-red">{errors.name}</span>}
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="label">Category</span>
                    <select
                      value={form.category}
                      onChange={(event) => {
                        const category = event.target.value as Category;
                        setForm((current) => ({
                          ...current,
                          category,
                          silhouette: CATEGORY_SILHOUETTE[category],
                        }));
                      }}
                      className="field"
                    >
                      {Object.keys(CATEGORY_SILHOUETTE).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="label">Badge</span>
                    <select
                      value={form.badge ?? ""}
                      onChange={(event) => patch("badge", (event.target.value || undefined) as Badge | undefined)}
                      className="field"
                    >
                      <option value="">No badge</option>
                      {["New", "Bestseller", "Limited", "Restock"].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="label">Fit label</span>
                    <input
                      value={form.fit}
                      onChange={(event) => patch("fit", event.target.value)}
                      placeholder="Slim, Straight, Trucker…"
                      className="field"
                    />
                  </label>

                  <label className="block">
                    <span className="label">Wash name</span>
                    <input
                      value={form.wash}
                      onChange={(event) => patch("wash", event.target.value)}
                      placeholder="Rinse Indigo"
                      className="field"
                    />
                  </label>

                  <label className="block">
                    <span className="label">Artwork silhouette</span>
                    <select
                      value={form.silhouette}
                      onChange={(event) => patch("silhouette", event.target.value as Silhouette)}
                      className="field"
                    >
                      {["jeans", "jacket", "cargo", "shirt"].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <span className="mt-1 block text-[10px] text-muted">Used only when no photos are added.</span>
                  </label>
                </div>

                <label className="flex items-center gap-3 border border-line bg-cream px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) => patch("featured", event.target.checked)}
                    className="h-4 w-4 accent-[#E51828]"
                  />
                  <span className="text-[12px]">Show on the homepage drop</span>
                </label>
              </section>

              {/* 03 pricing */}
              <section className="space-y-4">
                <div className="flex items-baseline gap-3 border-b border-line pb-2.5">
                  <span className="font-display text-sm font-bold text-red">03</span>
                  <h3 className="font-display text-base font-semibold">Pricing &amp; stock</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="label">Selling price (₹) *</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={form.price}
                      onChange={(event) => patch("price", Number(event.target.value))}
                      className="field"
                    />
                    {errors.price && <span className="mt-1 block text-[10px] text-red">{errors.price}</span>}
                  </label>
                  <label className="block">
                    <span className="label">MRP (₹)</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={form.mrp}
                      onChange={(event) => patch("mrp", Number(event.target.value))}
                      className="field"
                    />
                    {errors.mrp ? (
                      <span className="mt-1 block text-[10px] text-red">{errors.mrp}</span>
                    ) : (
                      <span className="mt-1 block text-[10px] text-muted">
                        {discount > 0 ? `Shows as ${discount}% off` : "Set above the price to show a discount"}
                      </span>
                    )}
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                  <label className="block">
                    <span className="label">Units in stock</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={form.stock}
                      onChange={(event) => patch("stock", Number(event.target.value))}
                      className="field"
                    />
                    {errors.stock && <span className="mt-1 block text-[10px] text-red">{errors.stock}</span>}
                  </label>
                  <div className="flex gap-2 pb-2">
                    {[10, 50].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => patch("stock", form.stock + amount)}
                        className="border border-line px-3 py-2 text-[10px] uppercase tracking-label text-muted transition-colors hover:border-ink hover:text-ink"
                      >
                        +{amount}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => patch("stock", 0)}
                      className="border border-line px-3 py-2 text-[10px] uppercase tracking-label text-muted transition-colors hover:border-ink hover:text-ink"
                    >
                      0
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="label">Sizes</span>
                    <div className="flex flex-wrap gap-1.5">
                      {SIZE_PRESETS.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setSizeText(preset.sizes.join(", "))}
                          className={cn(
                            "border px-2 py-1 text-[9px] uppercase tracking-[0.1em] transition-colors",
                            sizeText === preset.sizes.join(", ")
                              ? "border-red text-red"
                              : "border-line text-muted hover:border-ink hover:text-ink",
                          )}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    value={sizeText}
                    onChange={(event) => setSizeText(event.target.value)}
                    placeholder="28, 30, 32, 34, 36, 38"
                    className="field"
                  />
                  <p className="mt-1 text-[10px] text-muted">Comma separated. Shoppers pick one of these.</p>
                </div>
              </section>

              {/* 04 story */}
              <section className="space-y-4">
                <div className="flex items-baseline gap-3 border-b border-line pb-2.5">
                  <span className="font-display text-sm font-bold text-red">04</span>
                  <h3 className="font-display text-base font-semibold">Story, specs &amp; artwork</h3>
                </div>

                <label className="block">
                  <span className="label">Short description</span>
                  <textarea
                    value={form.story}
                    onChange={(event) => patch("story", event.target.value)}
                    rows={3}
                    placeholder="Two or three lines about the fit, fabric and who it's for."
                    className="field resize-none"
                  />
                </label>

                <label className="block">
                  <span className="label">Specs — one per line</span>
                  <textarea
                    value={detailText}
                    onChange={(event) => setDetailText(event.target.value)}
                    rows={4}
                    placeholder={"12 oz ring-spun denim\nSlim fit, mid rise\nCut & sewn in Ahmedabad"}
                    className="field resize-none"
                  />
                </label>

                <div>
                  <span className="label">Artwork wash palette</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {WASH_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => patch("palette", preset.palette)}
                        className="flex items-center gap-2 border border-line px-2.5 py-1.5 text-[10px] text-muted transition-colors hover:border-ink hover:text-ink"
                      >
                        <span
                          className="h-3.5 w-3.5 rounded-full ring-1 ring-inset ring-black/20"
                          style={{
                            background: `linear-gradient(140deg, ${preset.palette.light}, ${preset.palette.base} 55%, ${preset.palette.deep})`,
                          }}
                        />
                        {preset.name}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {(["light", "base", "deep"] as const).map((key) => (
                      <label key={key} className="flex items-center gap-2 border border-line bg-cream px-2 py-1.5">
                        <input
                          type="color"
                          value={form.palette[key]}
                          onChange={(event) => patch("palette", { ...form.palette, [key]: event.target.value })}
                          className="h-7 w-7 cursor-pointer border-0 bg-transparent p-0"
                          aria-label={`${key} shade`}
                        />
                        <span className="text-[9px] uppercase tracking-label text-muted">{key}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-line bg-paper px-5 py-3.5">
            <p className="hidden text-[9.5px] uppercase tracking-label text-muted sm:block">
              {draft.id ? "Changes go live immediately" : "Saving publishes to the shop"}
            </p>
            <div className="flex w-full gap-2 sm:w-auto">
              <button type="button" onClick={onClose} className={btn("quiet", "sm", "flex-1 border border-line sm:flex-none")}>
                Cancel
              </button>
              <button type="submit" className={btn("primary", "sm", "flex-1 sm:flex-none")}>
                <Check className="h-3.5 w-3.5" />
                {draft.id ? "Save changes" : "Publish product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
