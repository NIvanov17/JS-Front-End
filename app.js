//TODO...

function solve() {
    const BASE_URL = 'http://localhost:3030/jsonstore/records/';

    let recordChange;

    const buttons = {
        loadrecords: document.getElementById(`load-records`),
        editRecord: document.getElementById(`edit-record`),
        addRecord: document.getElementById(`add-record`)
    }

    const inputs = {
        name: document.getElementById(`p-name`),
        steps: document.getElementById(`steps`),
        calories: document.getElementById(`calories`)
    }


    buttons.loadrecords.addEventListener(`click`, loadAllRecords);
    buttons.editRecord.addEventListener(`click`, changeFunc);

    async function loadAllRecords() {
        const res = await fetch(BASE_URL);
        const recoreds = await res.json();
        clearAllSections();

        const ul = document.getElementById(`list`);
        Object.values(recoreds)
            .forEach((r) => {
                let li = createElement(`li`, null, `record`, null, ul);
                let div = createElement(`div`, null, `info`, null, li);
                createElement(`p`, r.name, null, null, div);
                createElement(`p`, r.steps, null, null, div);
                createElement(`p`, r.calories, null, null, div);
                let divBtns = createElement(`div`, null, `btn-wrapper`, null, li);
                let changeBtn = createElement(`button`, `Change`, `change-btn`, null, divBtns);
                changeBtn.addEventListener(`click`, () => {
                    recordChange = r;
                    li.remove();
                    inputs.name.value = r.name;
                    inputs.steps.value = r.steps;
                    inputs.calories.value = r.calories
                    buttons.editRecord.disabled = false;
                    buttons.addRecord.disabled = true;
                });
                let deleteBtn = createElement(`button`, `Delete`, `delete-btn`, null, divBtns);
                deleteBtn.addEventListener(`click`, async () => {
                    await fetch(`${BASE_URL}/${r._id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                     loadAllRecords();
                });

                ul.appendChild(li);
            });
        buttons.editRecord.disabled = true;
    }



    async function changeFunc() {
        await fetch(`${BASE_URL}/${recordChange._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: inputs.name.value,
                steps: inputs.steps.value,
                calories: inputs.calories.value,
                _id: recordChange._id
            })
        });
        Object.values(inputs).forEach(i => i.value = '');

        buttons.editRecord.disabled = true;
        buttons.addRecord.disabled = false;
        await loadAllRecords();
    }

    buttons.addRecord.addEventListener(`click`, addRecord);

    async function addRecord() {
        if (Object.values(inputs).some(i => i.value === ``)) {
            return;
        }

        await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: inputs.name.value,
                steps: inputs.steps.value,
                calories: inputs.calories.value
            })
        });
        await loadAllRecords();
        inputs.name.value = '';
        inputs.calories.value = '';
        inputs.steps.value = '';

    }

    function clearAllSections() {
        list.innerHTML = '';
    }

    function createElement(type, textContent, clas, id, parent) {
        const element = document.createElement(type);

        if (textContent) {
            element.textContent = textContent;
        }

        if (clas && clas.length > 0) {
            element.classList.add(clas)
        }

        if (id) {
            element.setAttribute("id", id)
        }

        if (parent) {
            parent.appendChild(element);
        }

        return element;
    }

}
solve();