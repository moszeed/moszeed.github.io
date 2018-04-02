# Unity Scripts

## PlayerLook.cs

``` cs

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerLook : MonoBehaviour
{
    public Transform playerBody;
    public float mouseSensitivity;

    float xAxisClamp = 0.0f;

    void Awake()
    {
        Cursor.lockState = CursorLockMode.Locked;
    }

    void Update()
    {
        RotateCamera();       
    }

    void RotateCamera()
    {
        float mouseX = Input.GetAxis("Mouse X");
        float mouseY = Input.GetAxis("Mouse Y");

        float rotAmountX = mouseX * mouseSensitivity;
        float rotAmountY = mouseY * mouseSensitivity;

        xAxisClamp -= rotAmountY;

        Vector3 targetRotCam = transform.rotation.eulerAngles;
        Vector3 targetRotBody = playerBody.rotation.eulerAngles;

        targetRotCam.x -= rotAmountY;
        targetRotCam.z = 0;
        targetRotBody.y += rotAmountX;

        if(xAxisClamp > 90)
        {
            xAxisClamp = 90;
            targetRotCam.x = 90;
        }
        else if(xAxisClamp < -90)
        {
            xAxisClamp = -90;
            targetRotCam.x = 270;
        }

        transform.rotation = Quaternion.Euler(targetRotCam);
        playerBody.rotation = Quaternion.Euler(targetRotBody);
    }



}

```


## PlayerMovement.cs

``` cs

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerMovement : MonoBehaviour {

	private CharacterController characterController;
	private Animator animator;

	[SerializeField]
	private float forwardMoveSpeed = 7.5f;

	[SerializeField]
	private float backwardMoveSpeed = 3;

	[SerializeField]
	private float turnSpeed = 150f;

	private void Awake() {
		characterController = GetComponent<CharacterController>();
		animator = GetComponentInChildren<Animator>();
	}

	private void Update() {
		var horizontal = Input.GetAxis("Horizontal");
		var vertical = Input.GetAxis("Vertical");

		animator.SetFloat("Speed", vertical);

		transform.Rotate(Vector3.up, horizontal * turnSpeed * Time.deltaTime);

		if (vertical != 0) {
			float moveSpeedToUse = (vertical > 0) ? forwardMoveSpeed : backwardMoveSpeed;
			characterController.SimpleMove(transform.forward * moveSpeedToUse * vertical);
		}
	}
}

```