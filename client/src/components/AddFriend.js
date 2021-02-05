import React from "react"
import { TextField } from "@material-ui/core"

const AddFriend = ({addFriend}) => {
    return (
            <form onSubmit={(e) => {
                debugger;
                e.preventDefault()
                addFriend(e.target.elements[0].value)
                e.target.reset()
            }}>
                <TextField label="Request Friend"/>
            </form>
    )
}

export default AddFriend;