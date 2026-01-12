const admin = require("firebase-admin");
const readline = require("readline");

// Initialize Firebase Admin
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to list all users
async function listAllUsers(nextPageToken) {
  // Only pass nextPageToken if it exists
  const listUsersResult = nextPageToken
    ? await admin.auth().listUsers(1000, nextPageToken)
    : await admin.auth().listUsers(1000);

  listUsersResult.users.forEach((userRecord, index) => {
    console.log(`${index + 1}. UID: ${userRecord.uid}, Email: ${userRecord.email}`);
  });

  if (listUsersResult.pageToken) {
    await listAllUsers(listUsersResult.pageToken);
  }
}

// Function to set admin claim
async function setAdmin(uid) {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`✅ Admin claim set for user ${uid}`);
  } catch (err) {
    console.error("❌ Error setting admin claim:", err);
  } finally {
    process.exit(0);
  }
}

// Run the script
(async function main() {
  try {
    console.log("Fetching all users...");
    await listAllUsers();

    rl.question("Enter the UID of the user you want to make admin: ", (uid) => {
      rl.close();
      setAdmin(uid.trim());
    });
  } catch (err) {
    console.error("Error:", err);
    rl.close();
    process.exit(1);
  }
})();
