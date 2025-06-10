class n{}function t(l){let e=!1;return{promise:l.then(a=>{if(e)throw new n;return a},a=>{throw e?new n:a}),cancel:()=>{e=!0},isCancelled:()=>e}}export{n as P,t as m};
