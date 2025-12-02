import { db } from "../name";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";

import { databases } from "./config";

export default async function getOrCreateDB(){
  try {
    await databases.get(db)
    console.log("Database already exists")
    
    // Check if collections exist, if not create them
    try {
      const collections = await databases.listCollections(db);
      const existingCollections = collections.collections.map(col => col.$id);
      
      const requiredCollections = ['questions', 'answers', 'comments', 'votes'];
      const missingCollections = requiredCollections.filter(col => !existingCollections.includes(col));
      
      if (missingCollections.length > 0) {
        console.log(`Creating missing collections: ${missingCollections.join(', ')}`);
        
        const collectionPromises = [];
        if (missingCollections.includes('questions')) collectionPromises.push(createQuestionCollection());
        if (missingCollections.includes('answers')) collectionPromises.push(createAnswerCollection());
        if (missingCollections.includes('comments')) collectionPromises.push(createCommentCollection());
        if (missingCollections.includes('votes')) collectionPromises.push(createVoteCollection());
        
        await Promise.all(collectionPromises);
        console.log("Missing collections created successfully");
      } else {
        console.log("All collections already exist");
      }
    } catch (collectionError) {
      console.log("Error checking/creating collections:", collectionError);
      throw collectionError;
    }
  } catch (error) {
    try {
      console.log("Database doesn't exist, creating new database...");
      await databases.create(db, db)
      console.log("Database created successfully")
      
      // Wait a bit for database to be ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      //create collections sequentially to avoid conflicts
      console.log("Creating collections...");
      await createQuestionCollection();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await createAnswerCollection();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await createCommentCollection();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await createVoteCollection();
      
      console.log("All collections created successfully");
      console.log("Database setup completed");
    } catch (createError) {
      console.error("Error creating database or collections:", createError);
      throw createError;
    }
  }

  return databases
}