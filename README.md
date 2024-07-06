
<img src="https://github.com/ahmedpopal456/FixitReactNative/assets/10645534/4b0f93df-05ee-49ec-b85b-3f36f3be022a">

### Fixit is a mobile application, meant to be the service allowing handymen and individuals in need of work/repairs to find them automatically through a matching system (kind of like Uber!)


> The entire Fixit repository library consist of microservices working in tandum, in scalable fashion, to address the contents and operations required by the application. 

**The application contains many innate features, including:**

1. Being able to create **"Fix Templates"**, or search for existing ones
   Fix templates are "typical job/repair" templates, that describe common jobs that people would want to get done (e.g., fixing a clogged toilet).
   Internal templates native to the app exist, covering all the legal "repair jobs" that are described by the Canadian government.
   Otherwise, a new template can be created on top of an existing one, by simply choosing to modify its fields (e.g., description, cost, etc.) 

2. Being able to searching for any kind of repair through a text-box
Doing so will trigger a search in our Azure AI Search service, which feeds off of all the past-job templates/descriptions
This search will return a "standard" template for the job that is asked for by the client, to which any changes can be made

3. Once a fix has been submitted, a matching algorithm using a basic A* search heuristic runs in a messaged-based (queue-based load levelling),
trigger, which will based on proximity, rating, and more, search for a finite list of handymen who could perform the job

 4. Notifications are then sent to those people using the Azure Notifications Hub service (which is used to send native IOS/ANDROID notifications)
 5. The handymen will then propose a new cost, or accept an existing one, and then send a finalized review for the client to approve.

> Mentions: 
The service has an internal, built-from scratch chat system integrated to allow communication between the client and the handyment, after being matched.


**This repository contains:** 
1. Both the android and ios sources for the mobile application
2. All of the necessary CI/CD templates/deployment scripts allowing for its deployment

Here are some pictures showing off these functionalities :)

---

> Home Page 
<img src="https://github.com/ahmedpopal456/FixitReactNative/assets/10645534/1fc4b349-4977-4fcc-8ff7-258fd77fcd1c" width="500" height="790">

---

> Changing your address
<img src="https://github.com/ahmedpopal456/FixitReactNative/assets/10645534/e1357816-d38b-40f9-997c-3b85f2ded253" width="400" height="790">

---

> Incoming Fix Request to Craftman
<img src="https://github.com/ahmedpopal456/FixitReactNative/assets/10645534/3f4a22e4-5030-433a-9922-e39165cd85a9" width="600" height="790">

---

> Craftsmen Selection page for the Client
<img src="https://github.com/ahmedpopal456/FixitReactNative/assets/10645534/c5669f6e-5103-48f4-9664-e3cc050369ec)" width="600" height="790">

---

> Creating a Fixit Template and the Request
<img src="https://github.com/ahmedpopal456/FixitReactNative/assets/10645534/6995b947-dca9-44a5-9dd2-cb3fd7404159" width="400" height="790">

---

> Showing in-progress fixes
<img src="https://github.com/ahmedpopal456/FixitReactNative/assets/10645534/98678014-69d1-4e01-afe8-8171bcb1972c" width="400" height="790">

---

> Chat page
<img src="https://github.com/ahmedpopal456/FixitReactNative/assets/10645534/d8bc3d17-d563-4eb6-bbdf-892beb08f0db" width="400" height="790">

---

> Submitting a request
<img src="https://github.com/ahmedpopal456/FixitReactNative/assets/10645534/133b8c12-255b-4f97-95aa-4e0255cf6fb6" width="400" height="790">
