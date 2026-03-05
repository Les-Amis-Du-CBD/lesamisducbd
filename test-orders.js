const url = "https://lesamisducbd.fr/api";
const key = "A71ZSF7AV89ZG3K84NPH6M83DAV81LQC";

async function checkAddr() {
    // Check address 1072 directly
    const res = await fetch(`${url}/addresses?ws_key=${key}&output_format=JSON&display=full&filter[id_customer]=861`);
    const data = await res.json();
    console.log("All addresses for customer 861:");
    (data.addresses || []).forEach(a => {
        console.log(`  ID:${a.id} alias:"${a.alias}" deleted:${JSON.stringify(a.deleted)} active:${JSON.stringify(a.active)} address1:"${a.address1}"`);
    });
}
checkAddr().catch(console.error);
