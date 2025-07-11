"use server"

export async function findYourMP(postalCode: string) {
  const url = `https://members-api.parliament.uk/api/Members/Search?Location=${encodeURIComponent(postalCode)}&skip=0&take=20`;
  try {
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }
    const data = await res.json();
    if (!data.items || data.items.length === 0) {
      return null;
    }
    const mp = data.items[0].value;
    const memberID = mp.id;

    let email = null;
    let phone = "None";

    if (memberID) {
      const contactUrl = `https://members-api.parliament.uk/api/Members/${memberID}/contact`;
      try {
        const contactRes = await fetch(contactUrl, { method: 'GET' });
        if (contactRes.ok) {
          const contactData = await contactRes.json();
          const contacts = contactData.value || [];
          // Email
          const emailEntry = contacts.find((c: any) => c.email);
          if (emailEntry) email = emailEntry.email;
          // Phone
          const phoneEntry = contacts.find((c: any) => c.phone);
          if (phoneEntry) phone = phoneEntry.phone;
        }
      } catch (e) {
        // Ignore contact fetch errors, just return base info
      }
    }

    return {
      nameFullTitle: mp.nameFullTitle,
      nameAddressAs: mp.nameAddressAs,
      partyName: mp.latestParty?.name,
      membershipFrom: mp.latestHouseMembership?.membershipFrom,
      email,
      phone,
      memberID,
    };
  } catch (error) {
    console.error("Error fetching MP info:", error);
    return null;
  }
}