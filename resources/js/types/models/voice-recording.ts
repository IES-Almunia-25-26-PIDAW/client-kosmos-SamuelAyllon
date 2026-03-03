export interface VoiceRecording {
    id: number;
    user_id: number;
    task_id: number | null;
    idea_id: number | null;
    file_path: string;
    transcription: string | null;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    duration: number | null;
    error_message: string | null;
    created_at: string;
    updated_at: string;
}
