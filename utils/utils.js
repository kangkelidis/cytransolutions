

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

export function toCurrency(number, withoutCents) {
  if (isNaN(number)) return;
  return number.toLocaleString(undefined, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: withoutCents ? 0 : 2,
    maximumFractionDigits: withoutCents ? 0 : 2,
  });
}

export function zeroPad(num, places) {
  console.log(num);
  return String(num).padStart(places, '0')
}


