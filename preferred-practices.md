# Project Preferred Practices

Many of the things listed below are for the sake of consistency rather than correctness. Each project does things a little differently, so these practices may not always be the ones you use, but we would like you to use them for this project when possible.

## Naming

1. Name **variables using camelCase** rather than PascalCase or snake_case
2. Name **subfolders in the app using camelCase** unless the **folder is primarily responsible for holding components**, in which case, **use PascalCase** (this is mostly for the sake of consistency)
3. In the image below, the folder including the `Navbar` and `OtherBar` are capitalized because their purpose is to only contain the component
   <img src="https://user-images.githubusercontent.com/67646012/231619162-f230c758-978d-460e-a2dd-b3aaa013976f.png" alt="Folder containing Navbar and Otherbar which are capitalized" width=200>

4. [Example of Naming Scheme](https://github.com/Hack4ImpactFall2021/y-knot/tree/master/src)

## Styling

1. **Avoid inline styling** (shown below) as much as possible. Try to keep most styling in the css file, but sometimes inline styling is needed.
   <img src="https://user-images.githubusercontent.com/67646012/231620141-3bd5ea13-b877-43d1-adcf-99c675c9efba.png" alt="Inline styling example" width=500>

2. Try to **give each component its own css file**. So if you are making the login page and it has 2 components (such as the text fields and the forget password popup), give those 2 components their own css files for styling.
3. An **exception** to the rule above is when the **same/similar styling is used throughout multiple components**.
   <img src="https://user-images.githubusercontent.com/67646012/231620506-26d340e4-af16-4d6e-8869-18690f437a32.png" alt="Multiple component folders are inside the student-profile folder since they the same similar styling" width=200>

- For example, let’s assume that the `ContactInformation`, `CreateStudent`, and `Forms` components all use buttons with the same styling. The only difference is that each button has a different background color.
  - One option is to just make a button component where the background color and button interactions can be passed as a prop.
  - Another option is to make buttons in each file and put the button styling in `StudentProfile.module.css`. That way each component can access the styling. Then, in the file where the buttons are created, they can be given 2 classNames. One can include the global button styling, while the other className corresponds to a local style which specifies the background color.
- The goal is to **limit the amount of reused code**.

## Organization

1. We will use a **singular global assets folder**. So if you need to store any images, store it in the `/assets` folder rather than within component subfolders.
   <img src="https://user-images.githubusercontent.com/67646012/231621173-40681110-f42a-44a6-a164-ab38ae6e92e4.png" alt="Singular assets folder" width=400>

2. Break up **subcomponents into their own folders**. Although this creates a lot more files, it makes the code a lot easier to read and fix. 3 files with 200 lines are a lot easier to read than 1 file with 600 lines.
3. Example of Folder Organization
   <img src="https://user-images.githubusercontent.com/67646012/231621371-01e32400-f6f7-45d4-8940-e716c7842e8a.png" alt="student-profile folder containing 6 different component sub-folders" width=200>

- In the image above, the `student-profile` folder contains all the code for the student profile page. We have a main `StudentProfile` TypeScript file which imports the other components and we have the CSS file `StudentProfile.module.css` which contains styling for `StudentProfile.tsx` as well as any global styling which may be shared by multiple components.
- The Student Profile contains 6 different components: `ContactInformation`, `CreateStudent`, `Forms`, `GradeInformation`, `GuardianInformation`, and `Header`. Each of those folders contain their own TypeScript and CSS Modules files.

1. Your component files will usually contain some sort of JavaScript functions which include logic for things such as clicking a button or submitting a form. Sometimes, these can become really large and are not needed in the current file.
   - **Try to put large functions (~30+ lines) in their own file, but remember that it is not always possible/practical.**
   - Remember that the **goal is to increase readability** for anyone who may be looking at the code in the future.
2. **Commonly used types** will be put in a **types folder** where each component can access it. **Types that are only useful in a certain file** (such as the typing of props) should be **defined in that file**.

# GitHub Best Practices & References

## Commit Messages

- Please try to use relatively **descriptive commit messages**. Write **what you did** (possibly higher level), and **why you did** it.
- Good article on commit messages: [How to Write a Commit Message](https://cbea.ms/git-commit/)

## Branch Naming

- We will be assigning numbers to each task. When creating a branch for your feature, please **include the ticket number in your branch name** for easy referencing (e.g. `1-event-dropdown`)

## Pull Requests

- When you are done with your task, please **open a PR and message Sophie and Akash** in Slack.
