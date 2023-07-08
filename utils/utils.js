export function changeSingleStateValue(setter, name, value) {
    setter((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }
  
  export async function delay(ms) {
    await new Promise((res) => setTimeout(res, ms));
  }
  