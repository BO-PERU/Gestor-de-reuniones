const url = 'https://yyqdysmfncahtumvoxnh.supabase.co/rest/v1/app_state';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5cWR5c21mbmNhaHR1bXZveG5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNTQzMzYsImV4cCI6MjA5NzgzMDMzNn0.E6ujyKDPm5uVUUE6U4A7h6k44AGsl26ljfrYBmjOWNg';

fetch(url, {
    method: 'POST',
    headers: {
        'apikey': key,
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation,resolution=merge-duplicates'
    },
    body: JSON.stringify({ id: 1, data: [] })
})
.then(res => {
    console.log("Status:", res.status);
    return res.text();
})
.then(text => console.log("Response:", text))
.catch(err => console.error("Fetch Error:", err));
