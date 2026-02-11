import AdminHeader from "../components/AdminHeader";
import { listMedia } from "../../../lib/queries";
import ModuleList from "../components/ModuleList";


export const dynamic = "force-dynamic";

interface MediaRow {
  id: number;
  title: string;
  category: string;
  url: string;
}

export default async function AdminMediaPage() {
  const media = await listMedia();

  const rows: MediaRow[] = media.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category ?? "—",
    url: item.url,
  }));

  const columns: { key: keyof MediaRow; label: string }[] = [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "url", label: "URL" },
  ];

  return (
    <div>
      <AdminHeader
        title="Media"
        description="Store image URLs and captions."
        actionHref="/admin/media/new"
        actionLabel="Add Media"
      />
      <ModuleList<MediaRow> initialRows={rows} columns={columns} modulePath="/admin/media" moduleApi="/api/media" />
    </div>
  );
}

