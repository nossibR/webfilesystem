
import type { FileEntity } from "./File";


const API_URL = "http://localhost:8080/api";


// GET: Retrieve all files
export async function getFiles(): Promise<FileEntity[]> {
    const response = await fetch(`${API_URL}/getfiles`);

    if (!response.ok) {
        throw new Error("Failed to retrieve files");
    }

    return response.json();
}


// POST: Upload a file
export async function uploadFile(file: File): Promise<number> {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(`${API_URL}/createfile`, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        throw new Error("Failed to upload file");
    }

    return response.json();
}


// PUT: Update file name
export async function updateFile(
    id: number,
    name: string
): Promise<number> {

    const params = new URLSearchParams({
        id: id.toString(),
        name: name
    });

    const response = await fetch(
        `${API_URL}/updatefile?${params.toString()}`,
        {
            method: "PUT"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update file");
    }

    return response.json();
}


// DELETE: Delete file
export async function deleteFile(id: number): Promise<number> {

    const response = await fetch(
        `${API_URL}/deletefile?id=${id}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to delete file");
    }

    return response.json();
}


export async function downloadFile(id: number): Promise<void> {

    const response = await fetch(
        `${API_URL}/downloadfile/${id}`
    );

    if (!response.ok) {
        throw new Error("Failed to download file");
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    // Extract filename from response headers if available
    const disposition = response.headers.get("Content-Disposition");

    const filename = disposition?.match(/filename="?([^"]+)"?/)?.[1]
        ?? `file-${id}`;

    link.download = filename;
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
}

