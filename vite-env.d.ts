

interface ImportMetaEnv {
    readonly BACKEND_URL: string;
    // Add other variables here as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  