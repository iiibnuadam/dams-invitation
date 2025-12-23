
import "dotenv/config";
import dbConnect from "../lib/mongodb";
import Invitation from "../models/Invitation";

async function check() {
  await dbConnect();
  const invitation = await Invitation.findOne({ slug: "sasti-adam" });
  if (invitation) {
      console.log(JSON.stringify(invitation.comments, null, 2));
  } else {
      console.log("Not found");
  }
  process.exit(0);
}

check();
