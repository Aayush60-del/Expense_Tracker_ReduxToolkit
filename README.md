# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
'








.container {

  max-width: 850px;

  margin: 40px auto;

  padding: 30px;

}



.heading {

  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 30px;

}



.heading h1 {

  font-size: 2rem;

  color: #1f2937;

}



.heading input[type="date"] {

  padding: 10px 15px;

  border: 1px solid #d1d5db;

  border-radius: 8px;

  background: white;

  cursor: pointer;

}



.Form {

  background: white;

  padding: 30px;

  border-radius: 15px;

  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);

}



.Form h2 {

  margin-bottom: 25px;

  color: #1f2937;

}



.Form h4 {

  margin-bottom: 15px;

  color: #4b5563;

}



.income,

.expense {

  border: none;

  padding: 12px 25px;

  border-radius: 10px;

  cursor: pointer;

  font-size: 15px;

  margin-right: 12px;

  transition: 0.3s;

}



.income {

  background: #e8fff1;

  color: #16a34a;

  border: 2px solid #22c55e;

}



.income:hover {

  transform: translateY(-2px);

}



.expense {

  background: #fff1f2;

  color: #dc2626;

  border: 2px solid #ef4444;

}



.expense:hover {

  transform: translateY(-2px);

}



.Form input[type="text"],

.Form input[type="date"],

.Form select,

.Form textarea {

  width: 100%;

  padding: 14px;

  margin-top: 8px;

  margin-bottom: 18px;

  border: 1px solid #d1d5db;

  border-radius: 10px;

  font-size: 15px;

  outline: none;

  transition: 0.3s;

}



.Form input:focus,

.Form select:focus,

.Form textarea:focus {

  border-color: #2563eb;

  box-shadow: 0 0 8px rgba(37, 99, 235, 0.2);

}



.Form textarea {

  resize: none;

  height: 100px;

}



.button-group {

  display: flex;

  justify-content: flex-end;

  gap: 15px;

  margin-top: 25px;

}



.button-group button {

  padding: 12px 30px;

  border: none;

  border-radius: 10px;

  font-size: 15px;

  cursor: pointer;

  transition: 0.3s;

}



.cancel-btn {

  background: #e5e7eb;

  color: #374151;

}



.cancel-btn:hover {

  background: #d1d5db;

}



.add-btn {

  background: #2563eb;

  color: white;

}



.add-btn:hover {

  background: #1d4ed8;

}



.bottom-btns {

  display: flex;

  justify-content: flex-end;

  gap: 15px;

  margin-top: 25px;

}



.bottom-btns button:first-child {

  background: #e5e7eb;

  color: #374151;

  border: none;

  padding: 12px 28px;

  border-radius: 10px;

  cursor: pointer;

}



.bottom-btns button:last-child {

  background: #2563eb;

  color: white;

  border: none;

  padding: 12px 28px;

  border-radius: 10px;

  cursor: pointer;

}



.bottom-btns button:last-child:hover {

  background: #1d4ed8;

}



.bottom-btns button:first-child:hover {

  background: #d1d5db;

}



.img img {

  width: 45px;

  height: 45px;

  border-radius: 50%;

  object-fit: cover;

}



@media (max-width: 768px) {

  .container {

    margin: 20px;

    padding: 15px;

  }



  .heading {

    flex-direction: column;

    gap: 15px;

    align-items: flex-start;

  }



  .income,

  .expense {

    width: 100%;

    margin-bottom: 10px;

  }



  .bottom-btns {

    flex-direction: column;

  }



  .bottom-btns button {

    width: 100%;

  }

}



.income-text {

  color: #16a34a;

  margin-bottom: 15px;

}



.expense-text {

  color: #dc2626;

  margin-bottom: 15px;

}