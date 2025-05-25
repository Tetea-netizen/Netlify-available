
export async function submitCharacter(userId, token, form, onSuccess, onError) {
  try {
    const res = await fetch('/user/appearance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userId,
        race: form.race,
        appearance: {
          face: form.face,
          hair: form.hair,
          hairColor: form.hairColor,
          eyeColor: form.eyeColor,
          outfit: form.outfit
        }
      })
    });

    const data = await res.json();
    if (res.ok) {
      onSuccess(data);
    } else {
      onError(data.error || 'Failed to save appearance');
    }
  } catch (err) {
    onError('Network or server error');
  }
}
