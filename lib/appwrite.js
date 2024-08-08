// import SignIn from '@/app/(auth)/sign-in';
import { Account, Avatars, Client, Databases, ID, Query, Storage} from 'react-native-appwrite';
export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.dev.plant', 
    projectId: '66b360ee002cef17ddea',
    databaseId: '66b36196002f0627a90c',

    usersCollectionId: '66b361dd0035c0d8f1cf',
    tagsCollectionId: '66b366ab0013cc644541',
    info_cardsCollectionId: '66b3659f003d911d8de2',
    diary_cardsCollectionId: '66b364e8001d82d4c5e3',
    diariesCollectionId: '66b362f80001b9f78cef',

    storageId: '66b3690800004c764107'
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// 
export const getAccount = async() => {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      throw new Error(error);
    }
  }

// Register User
export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email, 
            password,
            username
        )
        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password)

        const newUser = await databases.createDocument(
            config.databaseId, 
            config.usersCollectionId, 
            ID.unique, 
            {
                accountId: newAccount.$id, 
                email, 
                username, 
                avatar: avatarUrl
            }
        );

        return newUser; 
    } catch (error){
        throw new Error(error);
    }
}

export const getCurrentUser = async() => {
    try {
        // get all log in current user
        const currentAccount = await getAccount();

        if(!currentAccount) throw Error; 

        const currentUser = await databases.listDocuments(
            config.databaseId, 
            config.usersCollectionId, 
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error; 
        return currentUser.documents[0]
    } catch (error) {
        console.log(error)
        return null; 
    }
}

// Sign In
export async function signIn(email, password) {
    try {
      const hasActiveSession = await checkActiveSession();
      if (hasActiveSession) {
        console.warn('An active session already exists. Logging out...');
        await account.deleteSessions(); // Log out from all sessions
      }
      const session = await account.createEmailPasswordSession(email, password);
  
      return session;
    } catch (error) {
      throw new Error(error);
    }
  }

const checkActiveSession = async () => {
    try {
      const sessions = await account.listSessions();
      return sessions.total > 0; // Returns true if there are active sessions
    } catch (error) {
      console.error('Error checking sessions', error);
      return false;
    }
  };

// add to diary 
export const addToDiary = async () => {
  
}