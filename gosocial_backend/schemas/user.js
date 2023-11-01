export default {
   name: 'user',
   title: 'User',
   type: 'document',
   fields: [
      {
         name: 'userName',
         title: 'UserName',
         type: 'string',
      },
      {
         name: 'myId',
         title: 'MyId',
         type: 'string',
      },
      {
         name: 'email',
         title: 'Email',
         type: 'string',
      },
      {
         name: 'password',
         title: 'Password',
         type: 'string',
      },
      {
         name: 'gender',
         title: 'Gender',
         type: 'string',
      },
      {
         name: 'agreement',
         title: 'Agreement',
         type: 'boolean',
      },
      {
         name: 'image',
         title: 'Image',
         type: 'image',
         options: {
            hotspot: true,
         }
      },
      {
         name: 'tags',
         title: 'Tags',
         type: 'array',
         of: [{type: 'string'}]
      }
   ]
}