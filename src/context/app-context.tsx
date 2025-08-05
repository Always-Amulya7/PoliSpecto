
'use client';

import React, { createContext, useReducer, useContext, ReactNode, Dispatch, useEffect } from 'react';

// Types
interface HistoryItem {
  id: string;
  documentUrl: string;
  question: string;
  answer: string;
  timestamp: string;
  isReanalysis?: boolean;
}

type DocumentStatus = 'Active' | 'Archived' | 'Draft' | 'In Review' | 'Approved' | 'Rejected';

export interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  status: DocumentStatus;
  url: string;
}

interface Analytics {
    queriesThisMonth: number;
    avgProcessingTime: number;
    documentsProcessed: number;
}

interface Approval {
    id: string;
    documentName: string;
    question: string;
    answer: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    reason?: string;
}

interface Suggestion {
    id: string;
    documentUrl: string;
    question: string;
    suggestion: string;
}

export interface TeamMember {
    name: string;
    email: string;
    role: 'Admin' | 'Editor' | 'Viewer';
    avatar: string;
    initials: string;
}

interface Settings {
  bio: string;
  dob: string | null;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface VerifyDocumentResult {
    documentId: string;
    isValid: boolean;
    reason: string;
}

interface DocumentToAnalyze {
    url: string;
    name: string;
    type: 'url' | 'file';
}


interface AppState {
  history: HistoryItem[];
  documents: Document[];
  analytics: Analytics;
  approvals: Approval[];
  suggestions: Suggestion[];
  teamMembers: TeamMember[];
  settings: Settings;
  documentToAnalyze: DocumentToAnalyze | null;
  verificationResults: Record<string, VerifyDocumentResult>;
}

type Action =
  | { type: 'ADD_HISTORY'; payload: HistoryItem }
  | { type: 'ADD_DOCUMENT'; payload: Document }
  | { type: 'DELETE_DOCUMENT', payload: { id: string } }
  | { type: 'ADD_ANALYTICS_DATA'; payload: Partial<Analytics> }
  | { type: 'ADD_APPROVAL'; payload: Approval }
  | { type: 'UPDATE_APPROVAL_STATUS'; payload: { id: string; status: 'Approved' | 'Rejected', reason: string } }
  | { type: 'ADD_SUGGESTION'; payload: Suggestion }
  | { type: 'ADD_TEAM_MEMBER'; payload: TeamMember }
  | { type: 'REMOVE_TEAM_MEMBER'; payload: { email: string } }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'HYDRATE_STATE', payload: AppState}
  | { type: 'UPDATE_DOCUMENT_STATUS', payload: { id: string, status: DocumentStatus } }
  | { type: 'SET_DOCUMENT_TO_ANALYZE', payload: DocumentToAnalyze | null }
  | { type: 'ADD_VERIFICATION_RESULT', payload: VerifyDocumentResult }
  | { type: 'CLEAR_VERIFICATION_RESULTS' };

const initialState: AppState = {
  history: [],
  documents: [],
  analytics: {
      queriesThisMonth: 0,
      avgProcessingTime: 0,
      documentsProcessed: 0,
  },
  approvals: [],
  suggestions: [],
  teamMembers: [
      { name: 'Amulya Shrivastava', email: 'amulyadeep7@gmail.com', role: 'Admin', avatar: '', initials: 'AS' },
      { name: 'Anurag Pradhan', email: 'anuragpradhan3640@gmail.com', role: 'Viewer', avatar: '', initials: 'AP' },
  ],
  settings: {
    bio: 'This is a sample bio.',
    dob: null,
    emailNotifications: true,
    pushNotifications: false,
  },
  documentToAnalyze: null,
  verificationResults: {},
};

const AppContext = createContext<{ state: AppState; dispatch: Dispatch<Action> } | undefined>(undefined);

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'HYDRATE_STATE':
        return action.payload;
    case 'ADD_HISTORY':
      return {
        ...state,
        history: [action.payload, ...state.history],
      };
    case 'ADD_DOCUMENT':
       if (state.documents.some(doc => doc.url === action.payload.url)) {
            return state;
        }
      return {
        ...state,
        documents: [...state.documents, action.payload],
      };
    case 'DELETE_DOCUMENT': {
        const docToDelete = state.documents.find(d => d.id === action.payload.id);
        if (!docToDelete) return state;
        
        const urlToDelete = docToDelete.url;
        const idToDelete = docToDelete.id;

        const historyIdsToDelete = state.history
            .filter(item => item.documentUrl === urlToDelete)
            .map(item => item.id);
        
        const newVerificationResults = { ...state.verificationResults };
        if (newVerificationResults[idToDelete]) {
            delete newVerificationResults[idToDelete];
        }

        return {
          ...state,
          documents: state.documents.filter(doc => doc.id !== idToDelete),
          history: state.history.filter(item => item.documentUrl !== urlToDelete),
          approvals: state.approvals.filter(appr => !historyIdsToDelete.includes(appr.id)),
          suggestions: state.suggestions.filter(sugg => sugg.documentUrl !== urlToDelete),
          verificationResults: newVerificationResults,
        };
    }
    case 'ADD_ANALYTICS_DATA':
        return {
            ...state,
            analytics: {
                ...state.analytics,
                queriesThisMonth: state.analytics.queriesThisMonth + (action.payload.queriesThisMonth || 0),
                avgProcessingTime: action.payload.avgProcessingTime || state.analytics.avgProcessingTime,
                documentsProcessed: state.analytics.documentsProcessed + (action.payload.documentsProcessed || 0)
            }
        }
    case 'ADD_APPROVAL':
        return {
            ...state,
            approvals: [action.payload, ...state.approvals]
        }
    case 'UPDATE_APPROVAL_STATUS': {
        const historyItem = state.history.find(h => h.id === action.payload.id);
        if (!historyItem) return state;

        return {
            ...state,
            approvals: state.approvals.map(approval => 
                approval.id === action.payload.id 
                ? { ...approval, status: action.payload.status, reason: action.payload.reason } 
                : approval
            ),
            documents: state.documents.map(doc => {
                if (doc.url === historyItem.documentUrl) {
                    return { ...doc, status: action.payload.status };
                }
                return doc;
            })
        };
    }
    case 'ADD_SUGGESTION':
        return {
            ...state,
            suggestions: [action.payload, ...state.suggestions],
        }
    case 'ADD_TEAM_MEMBER':
        if (state.teamMembers.some(member => member.email === action.payload.email)) {
            return state; // Avoid duplicates
        }
        return {
            ...state,
            teamMembers: [...state.teamMembers, action.payload],
        }
    case 'REMOVE_TEAM_MEMBER':
        return {
            ...state,
            teamMembers: state.teamMembers.filter(member => member.email !== action.payload.email),
        }
    case 'UPDATE_SETTINGS':
        return {
            ...state,
            settings: {
                ...state.settings,
                ...action.payload,
            }
        }
    case 'UPDATE_DOCUMENT_STATUS':
        return {
            ...state,
            documents: state.documents.map(doc => 
                doc.id === action.payload.id
                ? { ...doc, status: action.payload.status }
                : doc
            )
        }
    case 'SET_DOCUMENT_TO_ANALYZE':
        return {
            ...state,
            documentToAnalyze: action.payload,
        };
    case 'ADD_VERIFICATION_RESULT':
        return {
            ...state,
            verificationResults: {
                ...state.verificationResults,
                [action.payload.documentId]: action.payload,
            },
        };
    case 'CLEAR_VERIFICATION_RESULTS':
        return {
            ...state,
            verificationResults: {},
        };
    default:
      return state;
  }
};

const LOCAL_STORAGE_KEY = 'polispecto-app-state';

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isInitialized, setIsInitialized] = React.useState(false);

  useEffect(() => {
    try {
      const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedState) {
          const loadedState = JSON.parse(storedState);
          // Perform any state hydration validation or migration here
          if(!loadedState.documents) loadedState.documents = [];
          if (!loadedState.suggestions) loadedState.suggestions = [];
          if (!loadedState.teamMembers) loadedState.teamMembers = initialState.teamMembers;
          if (!loadedState.settings) loadedState.settings = initialState.settings;
          if (!loadedState.verificationResults) loadedState.verificationResults = {};
          if (loadedState.approvals && !loadedState.approvals.every(a => 'answer' in a)) {
              loadedState.approvals = loadedState.approvals.map(a => ({...a, answer: ''}));
          }
          dispatch({ type: 'HYDRATE_STATE', payload: loadedState });
      }
    } catch (error) {
        console.error("Could not load state from localStorage", error);
        // Fallback to initial state
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
        try {
            const stateToSave = { ...state };
            // To prevent issues on re-hydration
            stateToSave.documentToAnalyze = null;
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
        } catch (error) {
            console.error("Could not save state to localStorage", error);
        }
    }
  }, [state, isInitialized]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
