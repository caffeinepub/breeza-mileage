import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Migration "migration";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

// Integrate migration module with the actor
(with migration = Migration.run)
actor {
  // Access control initialization
  let accessControlState = AccessControl.initState();
  // Include authorization mixin
  include MixinAuthorization(accessControlState);

  // UserProfile and FillUp types
  public type UserProfile = {
    name : Text;
    unitSystem : Text;
  };

  public type FillUp = {
    odometer : Int;
    fuelAdded : Float;
    totalFuelCost : Float; // new field to store total cost per fill-up
    timestamp : Time.Time;
  };

  // Persistent storage
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userMileageData = Map.empty<Principal, List.List<FillUp>>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
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

  // Mileage Data Management
  public shared ({ caller }) func addFillUp(odometer : Int, fuelAdded : Float, totalFuelCost : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add fill-ups");
    };

    let fillUp : FillUp = {
      odometer;
      fuelAdded;
      totalFuelCost;
      timestamp = Time.now();
    };

    let existingData = switch (userMileageData.get(caller)) {
      case (?data) { data };
      case null { List.empty<FillUp>() };
    };

    existingData.add(fillUp);
    userMileageData.add(caller, existingData);
  };

  public query ({ caller }) func getFillUps() : async [FillUp] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view fill-ups");
    };

    switch (userMileageData.get(caller)) {
      case (?data) { data.toArray() };
      case null { [] };
    };
  };

  // Admin function to view any user's fill-ups (for support/debugging)
  public query ({ caller }) func getUserFillUps(user : Principal) : async [FillUp] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view other users' fill-ups");
    };

    switch (userMileageData.get(user)) {
      case (?data) { data.toArray() };
      case null { [] };
    };
  };
};
