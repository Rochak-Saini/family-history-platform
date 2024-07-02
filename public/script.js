document.addEventListener('DOMContentLoaded', () => {
  const fetchMembers = () => {
    fetch('/family-members')
      .then(response => response.json())
      .then(data => {
        const membersList = document.getElementById('members-list');
        membersList.innerHTML = '';
        data.forEach(member => {
          const memberDiv = document.createElement('div');
          memberDiv.classList.add('col-md-4');
          memberDiv.innerHTML = `
            <div class="member card">
              <div class="card-body">
                <p class="card-text"><strong>ID:</strong> ${member.id}</p>
                <p class="card-text"><strong>Name:</strong> ${member.name}</p>
                <p class="card-text"><strong>Age:</strong> ${member.age}</p>
                <p class="card-text"><strong>Date of Birth:</strong> ${member.date_of_birth}</p>
                <p class="card-text"><strong>Date of Death:</strong> ${member.date_of_death || 'N/A'}</p>
                <p class="card-text"><strong>Description:</strong> ${member.description}</p>
                <img src="${member.image}" alt="${member.name}" class="img-fluid">
              </div>
            </div>
          `;
          membersList.appendChild(memberDiv);
        });
      });
  };

  fetchMembers();

  const addMemberForm = document.getElementById('add-member-form');
  addMemberForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const date_of_birth = document.getElementById('date_of_birth').value;
    const date_of_death = document.getElementById('date_of_death').value;
    const image = document.getElementById('image').value;
    const description = document.getElementById('description').value;

    fetch('/family-members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, age, date_of_birth, date_of_death, image, description })
    })
      .then(response => response.json())
      .then(() => {
        fetchMembers();
        addMemberForm.reset();
      });
  });

  const updateMemberForm = document.getElementById('update-member-form');
  updateMemberForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const id = document.getElementById('update-id').value;
    const name = document.getElementById('update-name').value;
    const age = document.getElementById('update-age').value;
    const date_of_birth = document.getElementById('update-date_of_birth').value;
    const date_of_death = document.getElementById('update-date_of_death').value;
    const image = document.getElementById('update-image').value;
    const description = document.getElementById('update-description').value;

    fetch(`/family-members/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, age, date_of_birth, date_of_death, image, description })
    })
      .then(response => response.json())
      .then(() => {
        fetchMembers();
        updateMemberForm.reset();
      });
  });

  const deleteMemberForm = document.getElementById('delete-member-form');
  deleteMemberForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const id = document.getElementById('delete-id').value;

    fetch(`/family-members/${id}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(() => {
        fetchMembers();
        deleteMemberForm.reset();
      });
  });
});
