import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Vocabulary types and state
  type Word = {
    text : Text;
    translation : Text;
    category : Text;
  };

  // User progress and rewards
  type UserProgress = {
    completedLessons : Nat;
    totalScore : Nat;
    stars : Nat;
  };

  public type Reward = {
    #bronzeStar;
    #silverStar;
    #goldStar;
  };

  public type UserProfile = {
    name : Text;
    age : ?Nat;
    preferredLanguage : Text;
  };

  let vocabulary = Map.empty<Text, [Word]>();
  let userProgress = Map.empty<Principal, UserProgress>();
  let userRewards = Map.empty<Principal, [Reward]>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Initialize vocabulary words (simplified)
  let animals : [Word] = [
    { text = "Dog"; translation = "Perro"; category = "Animals" },
    { text = "Cat"; translation = "Gato"; category = "Animals" },
    { text = "Bird"; translation = "Pájaro"; category = "Animals" },
  ];

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Vocabulary Management
  public shared ({ caller }) func initializeVocabulary() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can initialize vocabulary");
    };
    vocabulary.add("Animals", animals);
  };

  public query ({ caller }) func getWordsByCategory(category : Text) : async [Word] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access vocabulary");
    };
    switch (vocabulary.get(category)) {
      case (null) { [] };
      case (?words) { words };
    };
  };

  // Progress Tracking
  public shared ({ caller }) func completeLesson(score : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete lessons");
    };

    let currentProgress = switch (userProgress.get(caller)) {
      case (null) { { completedLessons = 0; totalScore = 0; stars = 0 } };
      case (?progress) { progress };
    };

    let updatedProgress = {
      completedLessons = currentProgress.completedLessons + 1;
      totalScore = currentProgress.totalScore + score;
      stars = currentProgress.stars;
    };

    userProgress.add(caller, updatedProgress);
  };

  public query ({ caller }) func getProgress() : async UserProgress {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view progress");
    };

    switch (userProgress.get(caller)) {
      case (null) {
        { completedLessons = 0; totalScore = 0; stars = 0 }
      };
      case (?progress) { progress };
    };
  };

  public query ({ caller }) func getUserProgress(user : Principal) : async UserProgress {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own progress");
    };

    switch (userProgress.get(user)) {
      case (null) {
        { completedLessons = 0; totalScore = 0; stars = 0 }
      };
      case (?progress) { progress };
    };
  };

  // Reward System
  public shared ({ caller }) func awardReward(user : Principal, reward : Reward) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can award rewards");
    };

    let currentRewards = switch (userRewards.get(user)) {
      case (null) { [] };
      case (?rewards) { rewards };
    };
    userRewards.add(user, currentRewards.concat([reward]));
  };

  public query ({ caller }) func getRewards() : async [Reward] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view rewards");
    };

    switch (userRewards.get(caller)) {
      case (null) { [] };
      case (?rewards) { rewards };
    };
  };

  public query ({ caller }) func getUserRewards(user : Principal) : async [Reward] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own rewards");
    };

    switch (userRewards.get(user)) {
      case (null) { [] };
      case (?rewards) { rewards };
    };
  };

  // Quiz Functionality
  public shared ({ caller }) func checkQuizAnswer(word : Text, translation : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can take quizzes");
    };

    let isCorrect = animals.any(
      func(w) {
        w.text == word and w.translation == translation
      }
    );
    isCorrect;
  };
};
