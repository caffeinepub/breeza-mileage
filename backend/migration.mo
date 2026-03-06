import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  type OldFillUp = {
    odometer : Int;
    fuelAdded : Float;
    timestamp : Time.Time;
  };

  type NewFillUp = {
    odometer : Int;
    fuelAdded : Float;
    totalFuelCost : Float;
    timestamp : Time.Time;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, { name : Text; unitSystem : Text }>;
    userMileageData : Map.Map<Principal, List.List<OldFillUp>>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, { name : Text; unitSystem : Text }>;
    userMileageData : Map.Map<Principal, List.List<NewFillUp>>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserMileageData = old.userMileageData.map<Principal, List.List<OldFillUp>, List.List<NewFillUp>>(
      func(_userId, oldFillUps) {
        oldFillUps.map<OldFillUp, NewFillUp>(
          func(oldFillUp) {
            {
              oldFillUp with
              totalFuelCost = 0.0 // Initialize old entries with default value
            };
          }
        );
      }
    );
    {
      userProfiles = old.userProfiles;
      userMileageData = newUserMileageData;
    };
  };
};
