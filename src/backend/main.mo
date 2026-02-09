import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    unitSystem : Text; // "metric" or "imperial"
  };

  public type FillUp = {
    odometer : Int;
    fuelAdded : Float;
  };

  // Per-user storage
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
  public shared ({ caller }) func addFillUp(odometer : Int, fuelAdded : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add fill-ups");
    };

    let fillUp : FillUp = {
      odometer = odometer;
      fuelAdded = fuelAdded;
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
