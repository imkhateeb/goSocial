// This is for getting user
export const userQuery = (userId) => {
   const query = `*[_type == "user" && _id == "${userId}"]`;
   return query;
}


// This query is for getting all the pins and related documents to that pin
export const searchQuery = (searchTerm) => {
   const query = `*[_type == "pin" && title match '${searchTerm}*' || category match '${searchTerm}*' || about match '${searchTerm}*']{
      image {
         asset -> {
            url
         }
      },
      _id,
      destination,
      postedBy -> {
         _id,
         userName,
      },
      save[] {
         _key,
         postedBy -> {
            _id,
            userName
         },
      },
   }`;
   return query;
}

export const feedQuery = `*[_type == 'pin'] order(_createdAt desc) {
   image {
      asset -> {
         url
      }
   },
   _id,
   destination,
   postedBy -> {
      _id,
      userName,
   },
   save[] {
      _key,
      postedBy -> {
         _id,
         userName
      },
   },
}`