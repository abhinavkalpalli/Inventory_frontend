import { apiCall } from "./apiCalls";
import { userUrl } from "../const/routes";

export const register=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",userUrl.register,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const otpVerify=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",userUrl.otpVerify,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const resendOtp=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("get",userUrl.resendOtp,{params:userData}).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const login=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",userUrl.login,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const addProduct=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",userUrl.addProduct,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const getProducts=()=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("get",userUrl.getProducts).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(err){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const addCustomer=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",userUrl.addCustomer,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const getCustomers=()=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("get",userUrl.getCustomers).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(err){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const sellProduct=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",userUrl.sellProduct,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(err){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const editProduct=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("put",userUrl.editProduct,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                console.log('autherr',err);
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const getsalesReport=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("get",userUrl.getsalesReport,{params:userData}).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(err){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const sendMail=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",userUrl.sendMail,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(err){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const forgotPassword=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",userUrl.forgotPassword,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const resetPassword=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",userUrl.resetPassword,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const deleteProduct=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("put",userUrl.deleteProduct,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                console.log('autherr',err);
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}