import { fireDB } from '../firebase'
const authenticationRefs = fireDB.collection('profiles');

const addNewUser = async (NewUser) => {
    await authenticationRefs.add({
        City: NewUser.City,
        ContactNumber: NewUser.ContactNumber,
        DoorNumber: NewUser.DoorNumber,
        Email: NewUser.Email,
        Name: NewUser.Name,
        Password: NewUser.Password,
        PostalCode: NewUser.PostalCode,
        Street: NewUser.Street
    })
}

const fetchusers = () => {
    return authenticationRefs
}

const updateUser = async (UserId, NewUser) => {
    const ref = authenticationRefs.doc(UserId);
    const updatedUser = {
        City: NewUser.City,
        ContactNumber: NewUser.ContactNumber,
        DoorNumber: NewUser.DoorNumber,
        Email: NewUser.Email,
        Name: NewUser.Name,
        Password: NewUser.Password,
        PostalCode: NewUser.PostalCode,
        Street: NewUser.Street
    }
    try {
        await ref.set({
          ...updatedUser
        }, {merge: true});
      } catch (error) {
        console.log("inside error here ==", {error});
      }
}

const deleteUsers = async (UserId) => {
    const ref = authenticationRefs.doc(UserId); // we are fetching value with id function
    // basically this call return promise. which we are handling and removing those entry below.
    try {
      await ref.delete()
    } catch (error) {
      console.log("inside error ==", {error});
    }
  }


export { addNewUser, fetchusers, updateUser, deleteUsers }