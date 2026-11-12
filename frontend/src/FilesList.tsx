import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";

import type { FileEntity } from "./File";
import type { Language } from "./App";

import {
    getFiles,
    uploadFile,
    updateFile,
    deleteFile,
    downloadFile
} from "./api";

import "./FilesList.css";

interface FilesListProps {
    language: Language;
}

export default function FilesList({ language }: FilesListProps) {

    const [files, setFiles] = useState<FileEntity[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const translations = {
        en: {
            uploadTitle: "Upload your files",
            uploadDescription: "Select a file from your computer to add it.",
            upload: "+ Upload file",
            uploading: "Uploading...",
            uploadError: "The file could not be uploaded.",
            loadError: "Unable to load files. Check your server connection.",
            downloadError: "Unable to download this file.",
            renameError: "Unable to rename this file.",
            renameFailed: "Rename failed.",
            deleteError: "Unable to delete this file.",
            deleteFailed: "Delete failed.",
            downloadFailed: "Download failed.",
            search: "Search files...",
            name: "Name",
            actions: "Actions",
            loading: "Loading files...",
            noFiles: "No files yet",
            noResults: "No files found",
            firstFile: "Upload your first file to get started.",
            searchHint: "Try another search.",
            file: "file",
            files: "files",
            download: "Download",
            rename: "Rename",
            delete: "Delete",
            renamePrompt: "Enter the new filename:",
            deleteConfirm: (name: string) =>
                `Are you sure you want to delete "${name}"?`,
        },

        fr: {
            uploadTitle: "Importer vos fichiers",
            uploadDescription: "Sélectionnez un fichier depuis votre ordinateur.",
            upload: "+ Importer un fichier",
            uploading: "Importation...",
            uploadError: "Impossible d'importer le fichier.",
            loadError: "Impossible de charger les fichiers. Vérifiez le serveur.",
            downloadError: "Impossible de télécharger ce fichier.",
            renameError: "Impossible de renommer ce fichier.",
            renameFailed: "Le renommage a échoué.",
            deleteError: "Impossible de supprimer ce fichier.",
            deleteFailed: "La suppression a échoué.",
            downloadFailed: "Le téléchargement a échoué.",
            search: "Rechercher des fichiers...",
            name: "Nom",
            actions: "Actions",
            loading: "Chargement des fichiers...",
            noFiles: "Aucun fichier",
            noResults: "Aucun fichier trouvé",
            firstFile: "Importez votre premier fichier pour commencer.",
            searchHint: "Essayez une autre recherche.",
            file: "fichier",
            files: "fichiers",
            download: "Télécharger",
            rename: "Renommer",
            delete: "Supprimer",
            renamePrompt: "Entrez le nouveau nom du fichier :",
            deleteConfirm: (name: string) =>
                `Voulez-vous vraiment supprimer "${name}" ?`,
        }
    };

    const t = translations[language];

    async function loadFiles() {
        try {
            setLoading(true);
            setError("");

            const data = await getFiles();
            setFiles(data);

        } catch (error) {
            console.error(error);
            setError(t.loadError);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (!file) return;

        try {
            setUploading(true);
            setError("");

            const result = await uploadFile(file);

            if (result === 1) {
                await loadFiles();
            } else {
                setError(t.uploadError);
            }

        } catch (error) {
            console.error(error);
            setError(t.uploadError);
        } finally {
            setUploading(false);
            event.target.value = "";
        }
    }

    async function handleDownload(id: number) {
        try {
            setError("");
            await downloadFile(id);
        } catch (error) {
            console.error(error);
            setError(t.downloadError);
        }
    }

    async function handleRename(file: FileEntity) {

        const newName = window.prompt(t.renamePrompt, file.name);

        if (!newName || newName.trim() === "") return;

        const cleanName = newName.trim();

        if (cleanName === file.name) return;

        try {
            setError("");

            const result = await updateFile(file.id, cleanName);

            if (result === 1) {
                await loadFiles();
            } else {
                setError(t.renameError);
            }

        } catch (error) {
            console.error(error);
            setError(t.renameFailed);
        }
    }

    async function handleDelete(file: FileEntity) {

        const confirmed = window.confirm(t.deleteConfirm(file.name));

        if (!confirmed) return;

        try {
            setError("");

            const result = await deleteFile(file.id);

            if (result === 1) {
                await loadFiles();
            } else {
                setError(t.deleteError);
            }

        } catch (error) {
            console.error(error);
            setError(t.deleteFailed);
        }
    }

    function getFileIcon(name: string) {
        const extension = name.split(".").pop()?.toLowerCase();

        switch (extension) {
            case "pdf":
                return "📕";

            case "png":
            case "jpg":
            case "jpeg":
            case "gif":
            case "webp":
                return "🖼️";

            case "doc":
            case "docx":
                return "📘";

            case "xls":
            case "xlsx":
            case "csv":
                return "📗";

            case "zip":
            case "rar":
                return "📦";

            case "txt":
                return "📄";

            default:
                return "📁";
        }
    }

    const filteredFiles = files.filter(file =>
        file.name.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        let cancelled = false;

        async function fetchFiles() {
            try {
                setLoading(true);
                setError("");

                const data = await getFiles();

                if (!cancelled) {
                    setFiles(data);
                }

            } catch (error) {
                console.error(error);

                if (!cancelled) {
                    setError(t.loadError);
                }

            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchFiles();

        return () => {
            cancelled = true;
        };
    }, []);
    return (
        <div className="files-list">

            <div className="files-list__upload">

                <div className="files-list__upload-icon">
                    ↑
                </div>

                <div className="files-list__upload-text">
                    <h3>{t.uploadTitle}</h3>
                    <p>{t.uploadDescription}</p>
                </div>

                <label
                    htmlFor="file-upload"
                    className={`files-list__upload-button ${uploading ? "disabled" : ""}`}
                >
                    {uploading ? t.uploading : t.upload}
                </label>

                <input
                    id="file-upload"
                    type="file"
                    onChange={handleUpload}
                    disabled={uploading}
                    hidden
                />

            </div>

            {error && (
                <div className="files-list__error">
                    {error}
                </div>
            )}

            <div className="files-list__toolbar">

                <div className="files-list__search">
                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder={t.search}
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>

                <span className="files-list__count">
                    {files.length} {files.length === 1 ? t.file : t.files}
                </span>

            </div>

            <div className="files-list__table">

                <div className="files-list__table-header">
                    <span>{t.name}</span>
                    <span>{t.actions}</span>
                </div>

                {loading ? (

                    <div className="files-list__empty">
                        {t.loading}
                    </div>

                ) : filteredFiles.length === 0 ? (

                    <div className="files-list__empty">

                        <div className="files-list__empty-icon">
                            📂
                        </div>

                        <h3>
                            {search ? t.noResults : t.noFiles}
                        </h3>

                        <p>
                            {search ? t.searchHint : t.firstFile}
                        </p>

                    </div>

                ) : (

                    filteredFiles.map(file => (

                        <div
                            className="files-list__item"
                            key={file.id}
                        >

                            <div className="files-list__file-info">

                                <div className="files-list__file-icon">
                                    {getFileIcon(file.name)}
                                </div>

                                <div className="files-list__file-details">

                                    <span className="files-list__file-name">
                                        {file.name}
                                    </span>

                                    <span className="files-list__file-id">
                                        File #{file.id}
                                    </span>

                                </div>

                            </div>

                            <div className="files-list__actions">

                                <button
                                    className="files-list__action download"
                                    onClick={() => handleDownload(file.id)}
                                    title={t.download}
                                    aria-label={`${t.download} ${file.name}`}
                                >
                                    ↓
                                    <span>{t.download}</span>
                                </button>

                                <button
                                    className="files-list__action rename"
                                    onClick={() => handleRename(file)}
                                    title={t.rename}
                                    aria-label={`${t.rename} ${file.name}`}
                                >
                                    ✎
                                    <span>{t.rename}</span>
                                </button>

                                <button
                                    className="files-list__action delete"
                                    onClick={() => handleDelete(file)}
                                    title={t.delete}
                                    aria-label={`${t.delete} ${file.name}`}
                                >
                                    ×
                                    <span>{t.delete}</span>
                                </button>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
}
