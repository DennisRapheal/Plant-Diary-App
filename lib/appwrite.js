import SignIn from '@/app/(auth)/sign-in';
import { Account, Avatars, Client, Databases, ID, Query, Storage} from 'react-native-appwrite';
export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.anjin.aora', 
    projectId: '66a3e06a003a2ae949a2',
    databaseId: '66b1f55a00326c9bcede',
    userCollectionId: '66b1f5a2000de0820ec7',
    videoCollectionId: '66b1f5e10025550ea1a3',
    storageId: '66b1f7d1002fb38a8feb'
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
            config.userCollectionId, 
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
            config.userCollectionId, 
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